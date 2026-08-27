import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { isDeepStrictEqual } from "node:util";
import Ajv2020 from "ajv/dist/2020.js";

const root = new URL("../BUILDINGS_DESIGN_BIBLE/", import.meta.url).pathname;
const readJson = (relativePath) =>
  JSON.parse(readFileSync(join(root, relativePath), "utf8"));
const jsonFiles = (relativePath) =>
  readdirSync(join(root, relativePath), { withFileTypes: true }).flatMap((entry) => {
    const child = join(relativePath, entry.name);
    if (entry.isDirectory()) return jsonFiles(child);
    return entry.name.endsWith(".json") ? [child] : [];
  });
const ajv = new Ajv2020({ allErrors: true, strict: true });
const schemas = {
  archetype: readJson("00_CORE/schemas/archetype.schema.json"),
  context: readJson("00_CORE/schemas/context-profile.schema.json"),
  modifier: readJson("00_CORE/schemas/modifier-profile.schema.json"),
  dna: readJson("00_CORE/schemas/architectural-dna.schema.json")
};

for (const [name, schema] of Object.entries(schemas)) {
  assert.equal(ajv.validateSchema(schema), true, `${name} schema is invalid`);
}

const validators = Object.fromEntries(
  Object.entries(schemas).map(([name, schema]) => [name, ajv.compile(schema)])
);

function validateAll(name, paths) {
  for (const path of paths) {
    const value = readJson(path);
    assert.equal(
      validators[name](value),
      true,
      `${path} failed ${name} schema: ${ajv.errorsText(validators[name].errors)}`
    );
  }
}

const archetypePaths = jsonFiles("01_ARCHETYPES");
const contextPaths = jsonFiles("08_VALIDATION/bdb-002");
const modifierPaths = jsonFiles("04_CONTEXT_MODIFIERS");
const dnaPaths = jsonFiles("08_VALIDATION/bdb-004");

validateAll("archetype", archetypePaths);
validateAll("context", contextPaths);
validateAll("modifier", modifierPaths);
validateAll("dna", dnaPaths);

const archetypes = archetypePaths.map(readJson);
const contexts = contextPaths.map(readJson);
const modifiers = modifierPaths.map(readJson);
const dnas = dnaPaths.map(readJson);

function uniqueIndex(values, key, label) {
  const index = new Map();
  for (const value of values) {
    const id = value[key];
    assert.equal(index.has(id), false, `duplicate ${label}: ${id}`);
    index.set(id, value);
  }
  return index;
}

const archetypeById = uniqueIndex(archetypes, "archetype_id", "archetype_id");
const contextById = uniqueIndex(contexts, "context_id", "context_id");
const modifierById = uniqueIndex(modifiers, "profile_id", "profile_id");
uniqueIndex(dnas, "dna_id", "dna_id");

const slotCodes = new Set([
  "FND", "STR", "WAL", "FAC", "ROF", "DOR", "WIN", "BAL",
  "VCR", "HCR", "CLM", "BND", "PRK", "SGN", "ORN", "TEC"
]);

function inspectChoicesAndRanges(node, path = "$") {
  if (Array.isArray(node)) {
    node.forEach((value, index) => inspectChoicesAndRanges(value, `${path}[${index}]`));
    return;
  }
  if (!node || typeof node !== "object") return;

  if (Array.isArray(node.allowed) && Array.isArray(node.preferred)) {
    const allowed = new Set(node.allowed);
    for (const value of node.preferred) {
      assert.equal(allowed.has(value), true, `${path}: preferred is not allowed: ${value}`);
    }
  }

  if (typeof node.min === "number" && typeof node.max === "number") {
    assert.equal(node.min <= node.max, true, `${path}: min exceeds max`);
    if (Array.isArray(node.preferred)) {
      assert.equal(node.preferred[0] >= node.min, true, `${path}: preferred min outside range`);
      assert.equal(node.preferred[1] <= node.max, true, `${path}: preferred max outside range`);
      assert.equal(node.preferred[0] <= node.preferred[1], true, `${path}: inverted preferred range`);
    }
  }

  for (const [key, value] of Object.entries(node)) {
    inspectChoicesAndRanges(value, `${path}.${key}`);
  }
}

for (const archetype of archetypes) {
  inspectChoicesAndRanges(archetype, archetype.archetype_id);

  const slotGroups = [
    archetype.slots.required,
    archetype.slots.optional,
    archetype.slots.forbidden
  ];
  const flattened = slotGroups.flat();
  assert.equal(new Set(flattened).size, flattened.length, `${archetype.archetype_id}: overlapping slots`);
  assert.deepEqual(new Set(flattened), slotCodes, `${archetype.archetype_id}: incomplete slot partition`);

  const allowedTransformations = new Set(archetype.transformations.allowed);
  for (const transformation of archetype.transformations.forbidden) {
    assert.equal(
      allowedTransformations.has(transformation),
      false,
      `${archetype.archetype_id}: transformation both allowed and forbidden`
    );
  }

  if (archetype.identity.unit_stacking === "required") {
    assert.equal(archetype.slots.required.includes("VCR"), true, `${archetype.archetype_id}: VCR must be required`);
  }
  if (archetype.lot_relationship.requires_corner_lot) {
    assert.equal(archetype.lot_relationship.street_frontages.min >= 2, true, `${archetype.archetype_id}: corner lot needs two frontages`);
  }
  assert.equal(
    Object.hasOwn(archetype.identity, "vertical_use_stack"),
    archetype.usage.primary === "mixed_use",
    `${archetype.archetype_id}: vertical_use_stack mismatch`
  );
}

const confidenceRank = { deprecated: 0, hypothesis: 1, researched: 2, validated: 3 };
const compareRules = (left, right) =>
  right.priority - left.priority ||
  right.strength - left.strength ||
  confidenceRank[right.confidence] - confidenceRank[left.confidence] ||
  (left.rule_id < right.rule_id ? -1 : left.rule_id > right.rule_id ? 1 : 0);

for (const dna of dnas) {
  const archetype = archetypeById.get(dna.provenance.archetype_id);
  assert.ok(archetype, `${dna.dna_id}: unknown archetype`);
  assert.equal(dna.identity_lock.archetype_id, archetype.archetype_id, `${dna.dna_id}: identity drift`);

  const expectedInvariants = archetype.invariants.map((item) => item.invariant_id);
  assert.deepEqual(dna.identity_lock.invariant_ids, expectedInvariants, `${dna.dna_id}: invariant drift`);
  assert.equal(isDeepStrictEqual(dna.constraint_envelope.slot_policy, archetype.slots), true, `${dna.dna_id}: slot drift`);

  for (const key of ["floor_count", "height_classes", "plan_shapes", "volume_complexity", "symmetry", "footprint_units"]) {
    assert.equal(
      isDeepStrictEqual(dna.constraint_envelope.morphology[key], archetype.morphology[key]),
      true,
      `${dna.dna_id}: morphology drift at ${key}`
    );
  }

  const context = contextById.get(dna.provenance.context_ids.at(-1));
  assert.ok(context, `${dna.dna_id}: unknown context`);
  assert.equal(
    archetype.context_compatibility.densities.allowed.includes(context.urban.density),
    dna.constraint_envelope.compatibility_check !== "rejected",
    `${dna.dna_id}: density compatibility mismatch`
  );
  assert.equal(
    archetype.context_compatibility.tech_levels.allowed.includes(context.temporal.tech_level),
    dna.constraint_envelope.compatibility_check !== "rejected",
    `${dna.dna_id}: technology compatibility mismatch`
  );

  const rules = [];
  const rulesById = new Map();
  for (const profileId of dna.provenance.modifier_profile_ids) {
    const profile = modifierById.get(profileId);
    assert.ok(profile, `${dna.dna_id}: unknown modifier profile`);
    for (const rule of profile.rules) {
      rules.push(rule);
      rulesById.set(rule.rule_id, rule);
    }
  }

  assert.equal(dna.directives.length, rules.length, `${dna.dna_id}: incomplete directive coverage`);
  for (const directive of dna.directives) {
    const rule = rulesById.get(directive.source_rule_id);
    assert.ok(rule, `${directive.directive_id}: unknown source rule`);
    const effectiveStrength = rule.strength * context.climate.intensity;
    assert.ok(Math.abs(directive.effective_strength - effectiveStrength) < 1e-12, `${directive.directive_id}: effective strength mismatch`);

    if (rule.operation === "weight_multiplier") {
      const expected = 1 + ((rule.value - 1) * effectiveStrength);
      assert.ok(Math.abs(directive.effective_value - expected) < 1e-12, `${directive.directive_id}: multiplier mismatch`);
    }
    if (rule.operation === "range_shift") {
      for (const [key, value] of Object.entries(rule.value)) {
        assert.ok(
          Math.abs(directive.effective_value[key] - (value * effectiveStrength)) < 1e-12,
          `${directive.directive_id}: range delta mismatch at ${key}`
        );
      }
    }
  }

  const expectedOrder = rules.toSorted(compareRules).map((rule) => rule.rule_id);
  assert.deepEqual(dna.decision_trace.rule_order, expectedOrder, `${dna.dna_id}: unstable rule order`);
  if (dna.status === "partial") {
    assert.equal(
      dna.warnings.some((warning) => warning.code === "INCOMPLETE_DOMAIN_COVERAGE"),
      true,
      `${dna.dna_id}: partial DNA must explain incomplete coverage`
    );
  }
}

console.log(
  `ok -- ${archetypes.length} archetypes, ${contexts.length} contexts, ` +
  `${modifiers.length} modifier profiles and ${dnas.length} DNA fixtures validated`
);
