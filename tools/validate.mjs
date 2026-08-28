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
  dna: readJson("00_CORE/schemas/architectural-dna.schema.json"),
  module: readJson("00_CORE/schemas/component-module.schema.json"),
  material: readJson("00_CORE/schemas/material.schema.json"),
  bdb005: readJson("00_CORE/schemas/bdb005-validation.schema.json"),
  family: readJson("00_CORE/schemas/architectural-family.schema.json"),
  bdb006: readJson("00_CORE/schemas/bdb006-validation.schema.json"),
  recipe: readJson("00_CORE/schemas/regional-recipe.schema.json"),
  bdb007: readJson("00_CORE/schemas/bdb007-validation.schema.json")
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
const contextPaths = [
  ...jsonFiles("08_VALIDATION/bdb-002"),
  ...jsonFiles("06_BUILDING_RECIPES/contexts")
];
const modifierPaths = jsonFiles("04_CONTEXT_MODIFIERS");
const dnaPaths = jsonFiles("08_VALIDATION/bdb-004");
const modulePaths = jsonFiles("02_COMPONENTS");
const materialPaths = jsonFiles("03_MATERIALS");
const bdb005Paths = jsonFiles("08_VALIDATION/bdb-005");
const familyPaths = jsonFiles("05_ARCHITECTURAL_FAMILIES");
const bdb006Paths = jsonFiles("08_VALIDATION/bdb-006");
const recipePaths = jsonFiles("06_BUILDING_RECIPES/recipes");
const bdb007Paths = jsonFiles("08_VALIDATION/bdb-007");

validateAll("archetype", archetypePaths);
validateAll("context", contextPaths);
validateAll("modifier", modifierPaths);
validateAll("dna", dnaPaths);
validateAll("module", modulePaths);
validateAll("material", materialPaths);
validateAll("bdb005", bdb005Paths);
validateAll("family", familyPaths);
validateAll("bdb006", bdb006Paths);
validateAll("recipe", recipePaths);
validateAll("bdb007", bdb007Paths);

const archetypes = archetypePaths.map(readJson);
const contexts = contextPaths.map(readJson);
const modifiers = modifierPaths.map(readJson);
const dnas = dnaPaths.map(readJson);
const modules = modulePaths.map(readJson);
const materials = materialPaths.map(readJson);
const bdb005Cases = bdb005Paths.map(readJson);
const families = familyPaths.map(readJson);
const bdb006Cases = bdb006Paths.map(readJson);
const recipes = recipePaths.map(readJson);
const bdb007Cases = bdb007Paths.map(readJson);

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
const dnaById = uniqueIndex(dnas, "dna_id", "dna_id");
const moduleById = uniqueIndex(modules, "module_id", "module_id");
const materialById = uniqueIndex(materials, "material_id", "material_id");
const bdb005CaseById = uniqueIndex(bdb005Cases, "case_id", "case_id");
const familyById = uniqueIndex(families, "family_id", "family_id");
uniqueIndex(bdb006Cases, "case_id", "case_id");
const recipeById = uniqueIndex(recipes, "recipe_id", "recipe_id");
uniqueIndex(bdb007Cases, "case_id", "case_id");

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

for (const context of contexts) {
  if (!context.geography) {
    assert.equal(
      context.data_provenance === undefined,
      true,
      `${context.context_id}: provenance without explicit geography is outside the localized-context contract`
    );
    continue;
  }

  assert.ok(context.data_provenance, `${context.context_id}: localized context requires data provenance`);
  const sourceById = uniqueIndex(
    context.data_provenance.sources,
    "source_id",
    `${context.context_id} provenance source_id`
  );
  const groupById = uniqueIndex(
    context.data_provenance.field_groups,
    "group_id",
    `${context.context_id} field group_id`
  );
  const referencedSources = new Set();
  const registeredPaths = new Set();

  for (const group of groupById.values()) {
    assert.equal(
      group.source_ids.length > 0,
      group.basis === "evidence",
      `${context.context_id}: evidence groups require sources and normalized hypotheses forbid them`
    );
    for (const sourceId of group.source_ids) {
      assert.ok(sourceById.has(sourceId), `${context.context_id}: unknown provenance source ${sourceId}`);
      referencedSources.add(sourceId);
    }
    for (const path of group.paths) {
      assert.equal(registeredPaths.has(path), false, `${context.context_id}: provenance path belongs to multiple groups: ${path}`);
      registeredPaths.add(path);
    }
  }

  assert.deepEqual(
    referencedSources,
    new Set(context.data_provenance.sources.map((source) => source.source_id)),
    `${context.context_id}: every provenance source must support a field group`
  );
}

function provenancePatternCovers(pattern, path) {
  if (pattern.endsWith(".*")) return path.startsWith(pattern.slice(0, -1));
  return pattern === path;
}

function contextAncestryIds(context) {
  const ids = [];
  const visited = new Set();
  let current = context;
  while (current) {
    assert.equal(visited.has(current.context_id), false, `${context.context_id}: context ancestry cycle at ${current.context_id}`);
    visited.add(current.context_id);
    ids.push(current.context_id);
    if (current.parent_context_id === null || current.parent_context_id === undefined) break;
    current = contextById.get(current.parent_context_id);
    assert.ok(current, `${context.context_id}: unknown parent context`);
  }
  return ids;
}

const contextScopeDepth = {
  global: 0,
  region: 1,
  city: 2,
  district: 3,
  block: 4,
  lot: 5,
  building_exception: 6
};

for (const context of contexts) {
  const ancestryIds = contextAncestryIds(context);
  if (ancestryIds.length < 2) continue;
  const parent = contextById.get(ancestryIds[1]);
  assert.equal(
    contextScopeDepth[context.scope] > contextScopeDepth[parent.scope],
    true,
    `${context.context_id}: child context scope must be more local than parent scope`
  );
}

function nearestContextWithField(context, field) {
  return contextAncestryIds(context)
    .map((contextId) => contextById.get(contextId))
    .find((candidate) => candidate[field] !== undefined);
}

function inheritedContextField(context, field) {
  return nearestContextWithField(context, field)?.[field];
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

for (const module of modules) {
  inspectChoicesAndRanges(module, module.module_id);
  assert.equal(
    module.module_id.startsWith(`${module.slot_code}_`),
    true,
    `${module.module_id}: module ID prefix does not match slot ${module.slot_code}`
  );

  const socketIds = new Set();
  for (const socket of module.sockets) {
    assert.equal(socketIds.has(socket.socket_id), false, `${module.module_id}: duplicate socket ${socket.socket_id}`);
    socketIds.add(socket.socket_id);
  }

  for (const materialRef of module.material_refs) {
    for (const materialId of materialRef.allowed_material_ids) {
      const material = materialById.get(materialId);
      assert.ok(material, `${module.module_id}: unknown material ${materialId}`);
      assert.equal(
        material.compatible_slots.includes(module.slot_code),
        true,
        `${module.module_id}: material ${materialId} does not accept slot ${module.slot_code}`
      );
    }
  }
}

for (const material of materials) {
  inspectChoicesAndRanges(material, material.material_id);
}

const approximatelyEqual = (left, right) => Math.abs(left - right) < 1e-12;

function assertModuleCompatible(module, dna, caseId) {
  const archetypeId = dna.identity_lock.archetype_id;
  const archetype = archetypeById.get(archetypeId);
  assert.ok(archetype, `${caseId}: unknown archetype ${archetypeId}`);

  if (module.compatibility.archetype_ids) {
    assert.equal(
      module.compatibility.archetype_ids.includes(archetypeId),
      true,
      `${caseId}: ${module.module_id} rejects archetype ${archetypeId}`
    );
  }
  assert.equal(
    module.compatibility.usage.includes(archetype.usage.primary),
    true,
    `${caseId}: ${module.module_id} rejects usage ${archetype.usage.primary}`
  );

  const allowedHeightClasses = dna.constraint_envelope.morphology.height_classes.allowed;
  assert.equal(
    module.compatibility.height_classes.some((heightClass) => allowedHeightClasses.includes(heightClass)),
    true,
    `${caseId}: ${module.module_id} has no compatible height class`
  );
  if (module.compatibility.max_floor_count !== undefined) {
    assert.equal(
      module.compatibility.max_floor_count >= dna.constraint_envelope.morphology.floor_count.min,
      true,
      `${caseId}: ${module.module_id} cannot satisfy the minimum floor count`
    );
  }

  for (const contextId of dna.provenance.context_ids) {
    const context = contextById.get(contextId);
    assert.ok(context, `${caseId}: unknown context ${contextId}`);
    assert.equal(
      module.compatibility.tech_levels.includes(context.temporal.tech_level),
      true,
      `${caseId}: ${module.module_id} rejects technology ${context.temporal.tech_level}`
    );
  }
}

for (const validationCase of bdb005Cases) {
  const dna = dnaById.get(validationCase.dna_id);
  assert.ok(dna, `${validationCase.case_id}: unknown DNA ${validationCase.dna_id}`);
  const directiveById = new Map(dna.directives.map((directive) => [directive.directive_id, directive]));
  const evaluatedDirectiveIds = new Set();

  for (const evaluation of validationCase.candidate_evaluations) {
    for (const directiveId of evaluation.directive_ids) {
      assert.ok(directiveById.has(directiveId), `${validationCase.case_id}: unknown directive ${directiveId}`);
      evaluatedDirectiveIds.add(directiveId);
    }

    for (const candidate of evaluation.candidates) {
      const source = candidate.candidate_kind === "module"
        ? moduleById.get(candidate.candidate_id)
        : materialById.get(candidate.candidate_id);
      assert.ok(source, `${validationCase.case_id}: unknown candidate ${candidate.candidate_id}`);
      if (candidate.candidate_kind === "module") {
        assertModuleCompatible(source, dna, validationCase.case_id);
      }
      assert.ok(approximatelyEqual(candidate.base_weight, source.base_weight), `${candidate.candidate_id}: base weight drift`);

      for (const directiveId of candidate.applied_directive_ids) {
        assert.equal(
          evaluation.directive_ids.includes(directiveId),
          true,
          `${candidate.candidate_id}: applied directive is outside target evaluation`
        );
        const directive = directiveById.get(directiveId);
        const selectorTags = directive.selector.candidate_tags_any ?? [];
        if (selectorTags.length > 0) {
          const candidateTerms = new Set([...source.tags, ...source.capabilities]);
          assert.equal(
            selectorTags.some((tag) => candidateTerms.has(tag)),
            true,
            `${candidate.candidate_id}: applied directive selector does not match ${directiveId}`
          );
        }
      }

      if (!candidate.eligible) {
        assert.equal(candidate.final_weight, 0, `${candidate.candidate_id}: ineligible candidate must have zero weight`);
        assert.equal(candidate.missing_capabilities.length > 0, true, `${candidate.candidate_id}: rejection must name missing capability`);
        for (const capability of candidate.missing_capabilities) {
          assert.equal(source.capabilities.includes(capability), false, `${candidate.candidate_id}: capability is not actually missing`);
        }
        continue;
      }

      assert.deepEqual(candidate.missing_capabilities, [], `${candidate.candidate_id}: eligible candidate has missing capability`);
      for (const directiveId of candidate.applied_directive_ids) {
        const directive = directiveById.get(directiveId);
        if (directive.operation === "require" && typeof directive.effective_value?.tag === "string") {
          assert.equal(
            source.capabilities.includes(directive.effective_value.tag),
            true,
            `${candidate.candidate_id}: required capability not satisfied for ${directiveId}`
          );
        }
      }
      const multiplier = candidate.applied_directive_ids
        .map((id) => directiveById.get(id))
        .filter((directive) => directive.operation === "weight_multiplier")
        .reduce((product, directive) => product * directive.effective_value, 1);
      const expectedWeight = Math.min(8, Math.max(0.05, source.base_weight * multiplier));
      assert.ok(approximatelyEqual(candidate.final_weight, expectedWeight), `${candidate.candidate_id}: final weight mismatch`);

      for (const directiveId of candidate.applied_directive_ids) {
        const directive = directiveById.get(directiveId);
        if (directive.operation !== "range_shift") continue;
        const parameterName = directive.target.split(".").at(-1);
        const baseRange = source.parameters[parameterName];
        const effectiveRange = candidate.effective_parameters?.[parameterName];
        assert.ok(baseRange, `${candidate.candidate_id}: missing base range ${parameterName}`);
        assert.ok(effectiveRange, `${candidate.candidate_id}: missing effective range ${parameterName}`);
        assert.ok(
          approximatelyEqual(effectiveRange.min, baseRange.min + directive.effective_value.min_delta),
          `${candidate.candidate_id}: shifted minimum mismatch for ${parameterName}`
        );
        assert.ok(
          approximatelyEqual(effectiveRange.max, baseRange.max + directive.effective_value.max_delta),
          `${candidate.candidate_id}: shifted maximum mismatch for ${parameterName}`
        );
      }
    }
  }

  for (const unresolvedId of validationCase.unresolved_directive_ids) {
    assert.ok(directiveById.has(unresolvedId), `${validationCase.case_id}: unknown unresolved directive ${unresolvedId}`);
  }
  const accountedFor = new Set([...evaluatedDirectiveIds, ...validationCase.unresolved_directive_ids]);
  const carriedForward = dna.directives
    .filter((directive) => directive.state === "carried_forward")
    .map((directive) => directive.directive_id);
  assert.deepEqual(accountedFor, new Set(carriedForward), `${validationCase.case_id}: carried directives not fully accounted for`);

  const assemblyIds = new Set(validationCase.assembly_probe.module_ids);
  for (const moduleId of assemblyIds) {
    assert.ok(moduleById.has(moduleId), `${validationCase.case_id}: assembly references unknown module ${moduleId}`);
    assertModuleCompatible(moduleById.get(moduleId), dna, validationCase.case_id);
  }
  for (const requiredSlot of dna.constraint_envelope.slot_policy.required) {
    assert.equal(
      [...assemblyIds].some((moduleId) => moduleById.get(moduleId).slot_code === requiredSlot),
      true,
      `${validationCase.case_id}: assembly misses required slot ${requiredSlot}`
    );
  }

  const socketUsage = new Map();
  for (const connection of validationCase.assembly_probe.connections) {
    assert.equal(assemblyIds.has(connection.from_module_id), true, `${validationCase.case_id}: from module not in assembly`);
    assert.equal(assemblyIds.has(connection.to_module_id), true, `${validationCase.case_id}: to module not in assembly`);
    const fromModule = moduleById.get(connection.from_module_id);
    const toModule = moduleById.get(connection.to_module_id);
    const fromSocket = fromModule.sockets.find((socket) => socket.socket_id === connection.from_socket_id);
    const toSocket = toModule.sockets.find((socket) => socket.socket_id === connection.to_socket_id);
    assert.ok(fromSocket, `${validationCase.case_id}: unknown socket ${connection.from_module_id}.${connection.from_socket_id}`);
    assert.ok(toSocket, `${validationCase.case_id}: unknown socket ${connection.to_module_id}.${connection.to_socket_id}`);
    assert.equal(fromSocket.interface, connection.interface, `${validationCase.case_id}: from interface mismatch`);
    assert.equal(toSocket.interface, connection.interface, `${validationCase.case_id}: to interface mismatch`);
    assert.notEqual(connection.from_module_id, connection.to_module_id, `${validationCase.case_id}: self-connections are forbidden`);
    assert.equal(fromSocket.role, "provider", `${validationCase.case_id}: from socket must be a provider`);
    assert.equal(toSocket.role, "consumer", `${validationCase.case_id}: to socket must be a consumer`);

    for (const [moduleId, socket] of [[connection.from_module_id, fromSocket], [connection.to_module_id, toSocket]]) {
      const key = `${moduleId}.${socket.socket_id}`;
      socketUsage.set(key, (socketUsage.get(key) ?? 0) + 1);
      assert.equal(socketUsage.get(key) <= socket.capacity, true, `${validationCase.case_id}: socket capacity exceeded at ${key}`);
    }
  }

  for (const moduleId of assemblyIds) {
    const module = moduleById.get(moduleId);
    for (const socket of module.sockets.filter((item) => item.required)) {
      assert.equal(
        (socketUsage.get(`${moduleId}.${socket.socket_id}`) ?? 0) > 0,
        true,
        `${validationCase.case_id}: required socket unconnected at ${moduleId}.${socket.socket_id}`
      );
    }
  }
}

for (const family of families) {
  inspectChoicesAndRanges(family, family.family_id);

  if (family.family_kind === "compositional" && family.scope === "transregional_prototype") {
    for (const excludedClaim of ["regional_prevalence", "cultural_ownership", "historical_lineage"]) {
      assert.equal(
        family.identity.does_not_claim.includes(excludedClaim),
        true,
        `${family.family_id}: transregional prototype must disclaim ${excludedClaim}`
      );
    }
  }

  const sourceById = uniqueIndex(family.knowledge.sources, "source_id", `${family.family_id} source_id`);
  const statementById = uniqueIndex(family.knowledge.statements, "statement_id", `${family.family_id} statement_id`);
  const referencedStatements = new Set();
  const referencedSources = new Set();
  const registerBasisRefs = (basisRefs, label) => {
    for (const statementId of basisRefs) {
      assert.ok(statementById.has(statementId), `${family.family_id}: ${label} references unknown statement ${statementId}`);
      referencedStatements.add(statementId);
    }
  };

  for (const statement of family.knowledge.statements) {
    assert.equal(
      statement.source_ids.length > 0,
      statement.kind === "evidence",
      `${family.family_id}: evidence must cite sources and design hypotheses must not`
    );
    for (const sourceId of statement.source_ids) {
      assert.ok(sourceById.has(sourceId), `${family.family_id}: unknown source ${sourceId}`);
      referencedSources.add(sourceId);
    }
  }
  registerBasisRefs(family.compatibility.basis_refs, "compatibility");
  for (const key of ["plan_shapes", "volume_complexity", "symmetry"]) {
    registerBasisRefs(family.composition[key].basis_refs, `composition.${key}`);
  }
  for (const [parameterName, parameter] of Object.entries(family.composition.parameters)) {
    registerBasisRefs(parameter.basis_refs, `composition.parameters.${parameterName}`);
  }

  const selectorIds = new Set();
  for (const selector of family.module_selectors) {
    assert.equal(selectorIds.has(selector.selector_id), false, `${family.family_id}: duplicate selector ${selector.selector_id}`);
    selectorIds.add(selector.selector_id);
    registerBasisRefs(selector.basis_refs, selector.selector_id);
    assert.equal(
      Object.hasOwn(selector, "weight_multiplier"),
      selector.operation === "prefer",
      `${family.family_id}: weight_multiplier must exist only on prefer selectors`
    );

    const sources = selector.target_kind === "module" ? modules : materials;
    const matches = sources.filter((source) => {
      const sourceSlots = selector.target_kind === "module" ? [source.slot_code] : source.compatible_slots;
      if (!selector.slot_codes.some((slotCode) => sourceSlots.includes(slotCode))) return false;
      if (selector.candidate_tags_any.length > 0 && !selector.candidate_tags_any.some((tag) => source.tags.includes(tag))) return false;
      return selector.candidate_capabilities_all.every((capability) => source.capabilities.includes(capability));
    });
    if (selector.operation !== "forbid") {
      assert.equal(matches.length > 0, true, `${family.family_id}: selector ${selector.selector_id} matches no catalog candidate`);
    }
  }

  assert.deepEqual(
    referencedStatements,
    new Set(family.knowledge.statements.map((statement) => statement.statement_id)),
    `${family.family_id}: knowledge statements must be used by the grammar`
  );
  assert.deepEqual(
    referencedSources,
    new Set(family.knowledge.sources.map((source) => source.source_id)),
    `${family.family_id}: knowledge sources must support a used statement`
  );

  for (const archetypeId of family.compatibility.archetype_ids) {
    const archetype = archetypeById.get(archetypeId);
    assert.ok(archetype, `${family.family_id}: unknown archetype ${archetypeId}`);
    assert.equal(family.compatibility.usage.includes(archetype.usage.primary), true, `${family.family_id}: usage mismatch for ${archetypeId}`);
    for (const heightClass of family.compatibility.height_classes) {
      assert.equal(archetype.morphology.height_classes.allowed.includes(heightClass), true, `${family.family_id}: height class outside ${archetypeId}`);
    }
    for (const techLevel of family.compatibility.tech_levels) {
      assert.equal(archetype.context_compatibility.tech_levels.allowed.includes(techLevel), true, `${family.family_id}: technology outside ${archetypeId}`);
    }
    for (const [key, archetypeKey] of [["plan_shapes", "plan_shapes"], ["volume_complexity", "volume_complexity"], ["symmetry", "symmetry"]]) {
      for (const choice of family.composition[key].allowed) {
        assert.equal(
          archetype.morphology[archetypeKey].allowed.includes(choice),
          true,
          `${family.family_id}: ${key} choice ${choice} violates ${archetypeId}`
        );
      }
    }
    const availableSlots = new Set([...archetype.slots.required, ...archetype.slots.optional]);
    for (const selector of family.module_selectors) {
      for (const slotCode of selector.slot_codes) {
        assert.equal(availableSlots.has(slotCode), true, `${family.family_id}: selector targets forbidden slot ${slotCode}`);
      }
    }
  }
}

function familyMissingConstraints(family, dna) {
  const missing = [];
  const archetype = archetypeById.get(dna.identity_lock.archetype_id);
  const context = contextById.get(dna.provenance.context_ids.at(-1));

  if (!family.compatibility.archetype_ids.includes(archetype.archetype_id)) missing.push(`archetype_id:${archetype.archetype_id}`);
  if (!family.compatibility.usage.includes(archetype.usage.primary)) missing.push(`usage:${archetype.usage.primary}`);
  if (!family.compatibility.height_classes.some((value) => dna.constraint_envelope.morphology.height_classes.allowed.includes(value))) {
    missing.push("height_classes");
  }
  if (!family.compatibility.tech_levels.includes(context.temporal.tech_level)) missing.push(`tech_level:${context.temporal.tech_level}`);
  if (family.compatibility.climate_primary.length > 0 && !family.compatibility.climate_primary.includes(context.climate.primary)) {
    missing.push(`climate_primary:${context.climate.primary}`);
  }
  if (family.compatibility.construction_periods.length > 0 && !family.compatibility.construction_periods.includes(context.temporal.construction_period)) {
    missing.push(`construction_period:${context.temporal.construction_period}`);
  }
  for (const [key, label] of [["plan_shapes", "plan_shapes"], ["volume_complexity", "volume_complexity"], ["symmetry", "symmetry"]]) {
    if (!family.composition[key].allowed.some((value) => dna.constraint_envelope.morphology[key].allowed.includes(value))) {
      missing.push(label);
    }
  }
  return missing;
}

function familyMissingConstraintsForContext(family, archetype, context) {
  const missing = [];
  if (!family.compatibility.archetype_ids.includes(archetype.archetype_id)) {
    missing.push(`archetype_id:${archetype.archetype_id}`);
  }
  if (!family.compatibility.usage.includes(archetype.usage.primary)) {
    missing.push(`usage:${archetype.usage.primary}`);
  }
  if (!family.compatibility.height_classes.some((value) => archetype.morphology.height_classes.allowed.includes(value))) {
    missing.push("height_classes");
  }
  if (!family.compatibility.tech_levels.includes(context.temporal.tech_level)) {
    missing.push(`tech_level:${context.temporal.tech_level}`);
  }
  if (family.compatibility.climate_primary.length > 0 && !family.compatibility.climate_primary.includes(context.climate.primary)) {
    missing.push(`climate_primary:${context.climate.primary}`);
  }
  if (
    family.compatibility.construction_periods.length > 0 &&
    !family.compatibility.construction_periods.includes(context.temporal.construction_period)
  ) {
    missing.push(`construction_period:${context.temporal.construction_period}`);
  }
  return missing;
}

for (const validationCase of bdb006Cases) {
  const dna = dnaById.get(validationCase.dna_id);
  assert.ok(dna, `${validationCase.case_id}: unknown DNA ${validationCase.dna_id}`);
  const upstream = bdb005CaseById.get(validationCase.upstream_bdb005_case_id);
  assert.ok(upstream, `${validationCase.case_id}: unknown upstream BDB-005 case`);
  assert.equal(upstream.dna_id, dna.dna_id, `${validationCase.case_id}: upstream DNA mismatch`);

  const directiveById = new Map(dna.directives.map((directive) => [directive.directive_id, directive]));
  const candidateIds = new Set();
  const appliedFamilyDirectiveIds = new Set();

  for (const candidate of validationCase.family_candidates) {
    assert.equal(candidateIds.has(candidate.family_id), false, `${validationCase.case_id}: duplicate family candidate ${candidate.family_id}`);
    candidateIds.add(candidate.family_id);
    const family = familyById.get(candidate.family_id);
    assert.ok(family, `${validationCase.case_id}: unknown family ${candidate.family_id}`);
    assert.ok(approximatelyEqual(candidate.base_weight, family.base_weight), `${candidate.family_id}: base weight drift`);

    const missingConstraints = familyMissingConstraints(family, dna);
    assert.deepEqual(candidate.missing_constraints, missingConstraints, `${candidate.family_id}: compatibility diagnostics drift`);
    assert.equal(candidate.eligible, missingConstraints.length === 0, `${candidate.family_id}: eligibility mismatch`);

    const familyTerms = new Set([...family.identity.tags, ...family.composition.tags]);
    const expectedAppliedDirectiveIds = candidate.eligible
      ? upstream.unresolved_directive_ids.filter((directiveId) => {
          const directive = directiveById.get(directiveId);
          const selectorTags = directive?.selector.candidate_tags_any ?? [];
          return directive?.target.startsWith("archetype.") && selectorTags.some((tag) => familyTerms.has(tag));
        })
      : [];
    assert.deepEqual(
      new Set(candidate.applied_directive_ids),
      new Set(expectedAppliedDirectiveIds),
      `${candidate.family_id}: applicable family directives were omitted or added`
    );
    const matchedTags = new Set();
    for (const directiveId of candidate.applied_directive_ids) {
      assert.equal(candidate.eligible, true, `${candidate.family_id}: ineligible family cannot consume directives`);
      assert.equal(upstream.unresolved_directive_ids.includes(directiveId), true, `${candidate.family_id}: directive was not pending after BDB-005`);
      const directive = directiveById.get(directiveId);
      assert.ok(directive, `${validationCase.case_id}: unknown directive ${directiveId}`);
      assert.equal(directive.operation, "weight_multiplier", `${candidate.family_id}: unsupported family directive operation`);
      assert.equal(directive.target.startsWith("archetype."), true, `${candidate.family_id}: family consumed non-morphological target`);
      const selectorTags = directive.selector.candidate_tags_any ?? [];
      const matches = selectorTags.filter((tag) => familyTerms.has(tag));
      assert.equal(matches.length > 0, true, `${candidate.family_id}: directive selector does not match ${directiveId}`);
      matches.forEach((tag) => matchedTags.add(tag));
      appliedFamilyDirectiveIds.add(directiveId);
    }
    assert.deepEqual(new Set(candidate.matched_tags), matchedTags, `${candidate.family_id}: matched tags drift`);

    if (!candidate.eligible) {
      assert.equal(candidate.final_weight, 0, `${candidate.family_id}: ineligible family must have zero weight`);
      continue;
    }
    const multiplier = candidate.applied_directive_ids
      .map((directiveId) => directiveById.get(directiveId).effective_value)
      .reduce((product, value) => product * value, 1);
    const expectedWeight = Math.min(8, Math.max(0.05, family.base_weight * multiplier));
    assert.ok(approximatelyEqual(candidate.final_weight, expectedWeight), `${candidate.family_id}: final weight mismatch`);
  }

  assert.deepEqual(candidateIds, new Set(families.map((family) => family.family_id)), `${validationCase.case_id}: incomplete family coverage`);

  const carriedForwardIds = dna.directives
    .filter((directive) => directive.state === "carried_forward")
    .map((directive) => directive.directive_id);
  const expectedUpstreamConsumed = carriedForwardIds.filter((directiveId) => !upstream.unresolved_directive_ids.includes(directiveId));
  assert.deepEqual(
    new Set(validationCase.upstream_consumed_directive_ids),
    new Set(expectedUpstreamConsumed),
    `${validationCase.case_id}: upstream directive accounting drift`
  );
  assert.deepEqual(
    new Set(validationCase.family_consumed_directive_ids),
    appliedFamilyDirectiveIds,
    `${validationCase.case_id}: family directive accounting drift`
  );
  assert.deepEqual(
    new Set([...validationCase.family_consumed_directive_ids, ...validationCase.unresolved_directive_ids]),
    new Set(upstream.unresolved_directive_ids),
    `${validationCase.case_id}: pending directives not fully accounted for`
  );

  const allLayerIds = [
    ...validationCase.upstream_consumed_directive_ids,
    ...validationCase.family_consumed_directive_ids,
    ...validationCase.unresolved_directive_ids
  ];
  assert.equal(new Set(allLayerIds).size, allLayerIds.length, `${validationCase.case_id}: directive consumed by multiple layers`);
  assert.equal(
    validationCase.status,
    validationCase.unresolved_directive_ids.length === 0 ? "layer_accounted" : "partial",
    `${validationCase.case_id}: status does not match unresolved directives`
  );
  assert.equal(
    validationCase.warnings.some((warning) => warning.code === "NO_REGIONAL_PREVALENCE_DATA"),
    true,
    `${validationCase.case_id}: family layer must defer regional prevalence`
  );
}

for (const recipe of recipes) {
  const sourceById = uniqueIndex(recipe.knowledge.sources, "source_id", `${recipe.recipe_id} source_id`);
  const statementById = uniqueIndex(recipe.knowledge.statements, "statement_id", `${recipe.recipe_id} statement_id`);
  const referencedStatements = new Set();
  const referencedSources = new Set();
  const registerBasisRefs = (basisRefs, label) => {
    for (const statementId of basisRefs) {
      assert.ok(statementById.has(statementId), `${recipe.recipe_id}: ${label} references unknown statement ${statementId}`);
      referencedStatements.add(statementId);
    }
  };

  for (const statement of recipe.knowledge.statements) {
    assert.equal(
      statement.source_ids.length > 0,
      statement.kind === "evidence",
      `${recipe.recipe_id}: evidence must cite sources and design hypotheses must not`
    );
    for (const sourceId of statement.source_ids) {
      assert.ok(sourceById.has(sourceId), `${recipe.recipe_id}: unknown source ${sourceId}`);
      referencedSources.add(sourceId);
    }
  }

  registerBasisRefs(recipe.scope.basis_refs, "scope");
  registerBasisRefs(recipe.prevalence.basis_refs, "prevalence");
  registerBasisRefs(recipe.family_diversity.basis_refs, "family diversity");
  for (const share of recipe.prevalence.quantitative_shares) {
    registerBasisRefs(share.basis_refs, `prevalence share ${share.family_id}`);
  }

  const recipeContexts = recipe.scope.context_anchor_ids.map((contextId) => {
    const context = contextById.get(contextId);
    assert.ok(context, `${recipe.recipe_id}: unknown context ${contextId}`);
    assert.ok(context.geography, `${recipe.recipe_id}: localized recipe context lacks geography`);
    assert.ok(context.data_provenance, `${recipe.recipe_id}: localized recipe context lacks provenance`);
    assert.equal(context.geography.country_code, recipe.scope.geography.country_code, `${recipe.recipe_id}: country scope drift`);
    assert.equal(context.geography.subdivision_code, recipe.scope.geography.subdivision_code, `${recipe.recipe_id}: subdivision scope drift`);
    assert.equal(context.geography.locality_code_system, recipe.scope.geography.locality_code_system, `${recipe.recipe_id}: locality code system drift`);
    assert.equal(context.geography.locality_code, recipe.scope.geography.locality_code, `${recipe.recipe_id}: locality scope drift`);
    assert.equal(
      recipe.scope.construction_periods.includes(context.temporal.construction_period),
      true,
      `${recipe.recipe_id}: construction period scope drift`
    );
    assert.equal(
      recipe.scope.cultural_variants.includes(context.cultural_matrix.regional_variant),
      true,
      `${recipe.recipe_id}: cultural variant scope drift`
    );
    const evidencePaths = context.data_provenance.field_groups
      .filter((group) => group.basis === "evidence")
      .flatMap((group) => group.paths);
    for (const requiredPath of [
      "$.geography.country_code",
      "$.geography.subdivision_code",
      "$.geography.locality_code_system",
      "$.geography.locality_code",
      "$.climate.primary",
      "$.temporal.construction_period",
      "$.temporal.tech_level"
    ]) {
      assert.equal(
        evidencePaths.some((pattern) => provenancePatternCovers(pattern, requiredPath)),
        true,
        `${recipe.recipe_id}: localized scope consumes field without evidence provenance: ${requiredPath}`
      );
    }
    return context;
  });

  const recipeArchetypes = recipe.scope.archetype_ids.map((archetypeId) => {
    const archetype = archetypeById.get(archetypeId);
    assert.ok(archetype, `${recipe.recipe_id}: unknown archetype ${archetypeId}`);
    return archetype;
  });

  const familyRuleById = uniqueIndex(recipe.family_rules, "family_id", `${recipe.recipe_id} family rule`);
  const eligibleFamilyIds = [];
  for (const rule of familyRuleById.values()) {
    registerBasisRefs(rule.basis_refs, `family rule ${rule.family_id}`);
    assert.equal(
      rule.relationship === "supported_candidate",
      rule.disposition === "eligible",
      `${recipe.recipe_id}: supported candidates must be eligible and counterexamples must be excluded`
    );
    const family = familyById.get(rule.family_id);
    assert.ok(family, `${recipe.recipe_id}: unknown family ${rule.family_id}`);
    if (rule.disposition !== "eligible") continue;
    eligibleFamilyIds.push(rule.family_id);
    for (const archetype of recipeArchetypes) {
      for (const context of recipeContexts) {
        assert.deepEqual(
          familyMissingConstraintsForContext(family, archetype, context),
          [],
          `${recipe.recipe_id}: eligible family ${rule.family_id} is incompatible with localized scope`
        );
      }
    }
  }

  if (recipe.recipe_kind === "documented_corpus") {
    assert.equal(recipe.activation.regional_sampling_allowed, false, `${recipe.recipe_id}: corpus cannot enable regional sampling`);
    assert.equal(recipe.activation.requires_explicit_corpus_opt_in, true, `${recipe.recipe_id}: corpus requires explicit opt-in`);
    assert.equal(
      ["corpus_limited", "blocked"].includes(recipe.activation.state),
      true,
      `${recipe.recipe_id}: documented corpus has invalid activation state`
    );
  }
  assert.equal(
    eligibleFamilyIds.length >= recipe.family_diversity.minimum_candidate_count,
    true,
    `${recipe.recipe_id}: eligible family count is below declared diversity floor`
  );
  if (recipe.family_diversity.status === "multiple_supported_candidates") {
    assert.equal(
      recipe.family_diversity.minimum_candidate_count >= 2,
      true,
      `${recipe.recipe_id}: multiple supported candidates require a floor of at least two`
    );
  }
  if (recipe.family_diversity.status === "single_supported_candidate") {
    assert.equal(
      recipe.family_diversity.minimum_candidate_count,
      1,
      `${recipe.recipe_id}: single supported candidate must declare a floor of one`
    );
  }

  const prevalence = recipe.prevalence;
  if (prevalence.claim_level === "quantified_regional") {
    assert.equal(prevalence.denominator_status, "defined", `${recipe.recipe_id}: quantified prevalence requires denominator`);
    assert.notEqual(prevalence.unit, null, `${recipe.recipe_id}: quantified prevalence requires counting unit`);
    assert.notEqual(prevalence.sample_size, null, `${recipe.recipe_id}: quantified prevalence requires sample size`);
    assert.equal(prevalence.quantitative_shares.length >= 2, true, `${recipe.recipe_id}: distribution requires at least two shares`);
    assert.ok(
      approximatelyEqual(prevalence.quantitative_shares.reduce((sum, item) => sum + item.share, 0), 1),
      `${recipe.recipe_id}: quantitative shares must sum to one`
    );
    for (const share of prevalence.quantitative_shares) {
      assert.equal(eligibleFamilyIds.includes(share.family_id), true, `${recipe.recipe_id}: share references non-eligible family`);
    }
  } else {
    assert.equal(prevalence.denominator_status, "unavailable", `${recipe.recipe_id}: non-quantified prevalence cannot claim denominator`);
    assert.equal(prevalence.unit, null, `${recipe.recipe_id}: non-quantified prevalence cannot claim counting unit`);
    assert.equal(prevalence.sample_size, null, `${recipe.recipe_id}: non-quantified prevalence cannot claim sample size`);
    assert.deepEqual(prevalence.quantitative_shares, [], `${recipe.recipe_id}: non-quantified prevalence cannot contain shares`);
    assert.equal(recipe.activation.regional_sampling_allowed, false, `${recipe.recipe_id}: non-quantified recipe cannot sample regionally`);
  }

  if (recipe.activation.regional_sampling_allowed) {
    assert.equal(recipe.recipe_kind, "regional_distribution", `${recipe.recipe_id}: only regional distributions may sample regionally`);
    assert.equal(recipe.activation.state, "active", `${recipe.recipe_id}: regional sampling requires active state`);
    assert.equal(prevalence.claim_level, "quantified_regional", `${recipe.recipe_id}: regional sampling requires quantified prevalence`);
    assert.deepEqual(recipe.activation.blocking_codes, [], `${recipe.recipe_id}: active recipe cannot retain blockers`);
  }
  if (recipe.status === "partial") {
    assert.equal(recipe.activation.blocking_codes.length > 0, true, `${recipe.recipe_id}: partial recipe must expose blockers`);
  }

  const deferredFeatureById = uniqueIndex(recipe.deferred_features, "feature_id", `${recipe.recipe_id} deferred feature`);
  const deferredGapCodes = new Set();
  for (const feature of deferredFeatureById.values()) {
    registerBasisRefs(feature.basis_refs, `deferred feature ${feature.feature_id}`);
    assert.equal(deferredGapCodes.has(feature.gap_code), false, `${recipe.recipe_id}: duplicate deferred gap code ${feature.gap_code}`);
    deferredGapCodes.add(feature.gap_code);

    for (const archetype of recipeArchetypes) {
      const availableSlots = new Set([...archetype.slots.required, ...archetype.slots.optional]);
      for (const slotCode of feature.slot_codes) {
        assert.equal(availableSlots.has(slotCode), true, `${recipe.recipe_id}: deferred feature targets forbidden slot ${slotCode}`);
      }
    }

    const sources = feature.target_kind === "module" ? modules : materials;
    const matches = sources.filter((source) => {
      const sourceSlots = feature.target_kind === "module" ? [source.slot_code] : source.compatible_slots;
      if (!feature.slot_codes.some((slotCode) => sourceSlots.includes(slotCode))) return false;
      if (!feature.candidate_tags_any.some((tag) => source.tags.includes(tag))) return false;
      return feature.candidate_capabilities_all.every((capability) => source.capabilities.includes(capability));
    });
    assert.deepEqual(
      matches,
      [],
      `${recipe.recipe_id}: deferred feature ${feature.feature_id} already has a semantic catalog candidate`
    );
  }

  assert.deepEqual(
    referencedStatements,
    new Set(recipe.knowledge.statements.map((statement) => statement.statement_id)),
    `${recipe.recipe_id}: knowledge statements must be used by the recipe`
  );
  assert.deepEqual(
    referencedSources,
    new Set(recipe.knowledge.sources.map((source) => source.source_id)),
    `${recipe.recipe_id}: knowledge sources must support a used statement`
  );
}

function recipeScopeMismatchCodes(recipe, context, archetypeId) {
  const codes = [];
  if (!recipe.scope.context_anchor_ids.some((contextId) => contextAncestryIds(context).includes(contextId))) {
    codes.push("CONTEXT_ANCESTRY_NOT_ALLOWED");
  }

  const geographyChecks = [
    ["country_code", "COUNTRY_CODE"],
    ["subdivision_code", "SUBDIVISION_CODE"],
    ["locality_code_system", "LOCALITY_CODE_SYSTEM"],
    ["locality_code", "LOCALITY_CODE"]
  ];
  const geography = inheritedContextField(context, "geography");
  for (const [field, codePrefix] of geographyChecks) {
    const actual = geography?.[field];
    if (actual === undefined) codes.push(`${codePrefix}_MISSING`);
    else if (actual !== recipe.scope.geography[field]) codes.push(`${codePrefix}_MISMATCH`);
  }

  if (!recipe.scope.construction_periods.includes(context.temporal.construction_period)) {
    codes.push("CONSTRUCTION_PERIOD_NOT_ALLOWED");
  }
  if (!recipe.scope.cultural_variants.includes(context.cultural_matrix.regional_variant)) {
    codes.push("CULTURAL_VARIANT_NOT_ALLOWED");
  }
  if (!recipe.scope.archetype_ids.includes(archetypeId)) codes.push("ARCHETYPE_NOT_ALLOWED");
  return codes;
}

for (const validationCase of bdb007Cases) {
  const recipe = recipeById.get(validationCase.recipe_id);
  assert.ok(recipe, `${validationCase.case_id}: unknown recipe ${validationCase.recipe_id}`);
  const context = contextById.get(validationCase.context_id);
  assert.ok(context, `${validationCase.case_id}: unknown context ${validationCase.context_id}`);
  assert.ok(archetypeById.has(validationCase.archetype_id), `${validationCase.case_id}: unknown archetype`);

  const mismatchCodes = recipeScopeMismatchCodes(recipe, context, validationCase.archetype_id);
  const matched = mismatchCodes.length === 0;
  assert.equal(validationCase.expected_match, matched, `${validationCase.case_id}: expected_match drift`);
  assert.deepEqual(new Set(validationCase.mismatch_codes), new Set(mismatchCodes), `${validationCase.case_id}: mismatch diagnostics drift`);

  const expectedResolution = !matched
    ? "rejected"
    : recipe.activation.state === "active"
      ? "matched_active"
      : "matched_corpus_limited";
  assert.equal(validationCase.resolution_status, expectedResolution, `${validationCase.case_id}: resolution status drift`);

  const expectedFamilyIds = matched
    ? recipe.family_rules.filter((rule) => rule.disposition === "eligible").map((rule) => rule.family_id)
    : [];
  const expectedDeferredFeatureIds = matched
    ? recipe.deferred_features.map((feature) => feature.feature_id)
    : [];
  assert.deepEqual(
    new Set(validationCase.family_candidate_ids),
    new Set(expectedFamilyIds),
    `${validationCase.case_id}: family candidate set drift`
  );
  assert.deepEqual(
    new Set(validationCase.deferred_feature_ids),
    new Set(expectedDeferredFeatureIds),
    `${validationCase.case_id}: deferred feature set drift`
  );

  const expectedSelectionState = !matched
    ? "blocked_context_mismatch"
    : recipe.activation.regional_sampling_allowed
      ? "ready_for_regional_sampling"
      : "deferred_missing_regional_prevalence";
  assert.equal(validationCase.selection_state, expectedSelectionState, `${validationCase.case_id}: selection state drift`);

  const expectedBlockingCodes = matched
    ? recipe.activation.blocking_codes
    : ["CONTEXT_SCOPE_MISMATCH"];
  assert.deepEqual(
    new Set(validationCase.blocking_codes),
    new Set(expectedBlockingCodes),
    `${validationCase.case_id}: blocking code drift`
  );
  const warningCodes = new Set(validationCase.warnings.map((warning) => warning.code));
  for (const blockingCode of expectedBlockingCodes) {
    assert.equal(warningCodes.has(blockingCode), true, `${validationCase.case_id}: blocker lacks warning ${blockingCode}`);
  }
  const provenanceOwner = nearestContextWithField(context, "data_provenance");
  const inheritedProvenance = provenanceOwner?.data_provenance;
  if (matched && provenanceOwner && provenanceOwner.context_id !== context.context_id) {
    for (const [actual, inherited, label] of [
      [context.climate.primary, provenanceOwner.climate.primary, "climate.primary"],
      [context.temporal.construction_period, provenanceOwner.temporal.construction_period, "temporal.construction_period"],
      [context.temporal.tech_level, provenanceOwner.temporal.tech_level, "temporal.tech_level"],
      [context.cultural_matrix.regional_variant, provenanceOwner.cultural_matrix.regional_variant, "cultural_matrix.regional_variant"]
    ]) {
      assert.equal(actual, inherited, `${validationCase.case_id}: descendant overrides evidence-bound ${label} without local provenance`);
    }
  }
  if (matched && ["hypothesis", "mixed"].includes(inheritedProvenance?.status)) {
    assert.equal(
      warningCodes.has("NORMALIZED_CONTEXT_PARAMETERS"),
      true,
      `${validationCase.case_id}: mixed context must expose normalized parameters`
    );
  }
}

console.log(
  `ok -- ${archetypes.length} archetypes, ${contexts.length} contexts, ` +
  `${modifiers.length} modifier profiles, ${dnas.length} DNA fixtures, ` +
  `${modules.length} modules, ${materials.length} materials, ${bdb005Cases.length} BDB-005 cases, ` +
  `${families.length} families, ${bdb006Cases.length} BDB-006 cases, ` +
  `recipes=${recipes.length}, BDB-007 cases=${bdb007Cases.length}; validated`
);
