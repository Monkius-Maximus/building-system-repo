# BDB-003-C — Matriz de Lacunas Morfológicas

**Projeto:** Buildings Design Bible  
**Versão:** 0.1  
**Status:** 🟡 Investigação morfológica  
**Dependências:** `BDB-003_ARQUETIPOS_UNIVERSAIS.md`, `BUILDING_TYPE_CATALOG.md`, `BUILDING_TYPE_NORMALIZATION_MATRIX.md`, `00_CORE/schemas/archetype.schema.json`  
**Princípio:** nenhum item desta matriz é um novo arquétipo implementado.

---

## 1. Objetivo

Esta matriz transforma os `NEW_ARCHETYPE_CANDIDATE` da normalização em problemas morfológicos verificáveis.

Ela existe para responder uma pergunta antes de criar qualquer nova ficha BDB-003:

> **Qual característica estrutural, espacial ou de implantação o conjunto atual de arquétipos não consegue representar sem deformação, exceção silenciosa ou contrato inconsistente?**

O processo é deliberadamente conservador:

```text
CATÁLOGO
   ↓
NORMALIZAÇÃO
   ↓
CANDIDATO
   ↓
LACUNA MORFOLÓGICA
   ↓
PROVA DE NECESSIDADE
   ↓
NOVO ARQUÉTIPO (somente se necessário)
```

Uma diferença de uso, material, clima, cultura, riqueza ou aparência não é suficiente para criar um arquétipo.

---

## 2. Critérios de aprovação

Um candidato somente poderá virar arquétipo quando todos os pontos abaixo forem atendidos:

1. **Identidade:** existe pelo menos um invariante que o separa dos arquétipos existentes.
2. **Morfologia:** a diferença produz uma família volumétrica, implantação ou organização espacial relevante.
3. **Contrato:** a diferença pode ser expressa pelo schema atual sem criar campos específicos arbitrários.
4. **Slots:** há categorias BDB-005 que sustentam a identidade do candidato.
5. **Lote:** existe relação própria ou significativamente diferente com o lote/rua.
6. **Escalonamento:** é possível indicar de onde o edifício veio e para onde deve reclassificar quando seus limites forem ultrapassados.
7. **Cobertura:** o arquétipo atende mais de um caso real do catálogo; não é criado para uma única palavra.

Se algum ponto falhar, o candidato permanece como `REUSE_ARCHETYPE`, `COMPOSITION`, `CONTEXT_VARIATION` ou `UNRESOLVED`.

---

## 3. Estados desta matriz

| Estado | Significado |
|---|---|
| `INVESTIGATE` | Há lacuna plausível, mas falta provar sua necessidade. |
| `REUSE_UNTIL_PROVEN` | O arquétipo atual deve ser reutilizado até que um caso concreto demonstre insuficiência. |
| `COMPOSITION_FIRST` | Deve ser modelado inicialmente como composição, antes de criar um arquétipo monolítico. |
| `NEW_ARCHETYPE_JUSTIFIED` | A investigação encontrou uma distinção morfológica que justifica nova ficha. **Ainda requer implementação.** |
| `DEFERRED` | A lacuna depende de outro sistema ou de uma decisão posterior do BDB. |

---

## 4. Matriz principal

| Candidato | Lacuna a provar | Arquétipo vizinho | Invariante provável | Slots críticos | Relação com lote | Estado |
|---|---|---|---|---|---|---|
| `TYPE_RESIDENTIAL_TOWER` | Torre residencial pode exigir organização vertical e implantação distinta de edifício residencial médio. | `BLD_RES_APARTMENT_MIDRISE` | `volume_types = tower/podium_tower`; faixa vertical superior ao midrise. | `STR`, `VCR`, `FAC`, `ROF`, `TEC` | lote independente; implantação vertical; possível recuo distinto. | `INVESTIGATE` |
| `TYPE_RESIDENTIAL_DORMITORY` | Ocupação coletiva com quartos e espaços comuns não é necessariamente apartamento convencional. | `BLD_RES_APARTMENT_WALKUP` | ocupação coletiva + áreas comuns programáticas. | `HCR`, `VCR`, `WIN`, `TEC` | lote institucional/residencial; acessos coletivos. | `INVESTIGATE` |
| `TYPE_COMMERCIAL_MARKET` | Mercado pode exigir grande espaço público interno, bancas e circulação coletiva. | `BLD_COM_STREET_SHOP` | grande salão/pavilhão ou composição de unidades. | `STR`, `HCR`, `FAC`, `ROF`, `SGN` | pode exigir lote maior e acesso múltiplo. | `INVESTIGATE` |
| `TYPE_COMMERCIAL_SHOPPING_CENTER` | Múltiplas unidades, circulação interna e possível estacionamento estruturado. | `BLD_MIX_URBAN_BLOCK` | conjunto comercial com circulação coletiva interna. | `STR`, `HCR`, `VCR`, `PRK`, `SGN`, `TEC` | lote grande; acessos múltiplos. | `NEW_ARCHETYPE_JUSTIFIED` |
| `TYPE_COMMERCIAL_GALLERY` | Galeria é uma sequência de lojas organizada por circulação interna comum. | `BLD_COM_STREET_SHOP` | circulação coletiva interna como parte da identidade. | `HCR`, `FAC`, `DOR`, `SGN` | pode ocupar lote profundo ou bloco. | `INVESTIGATE` |
| `TYPE_MIXED_MARKET_HALL` | Grande salão comercial combinado com outros usos pode ser composição, não edifício simples. | `BLD_MIX_URBAN_BLOCK` | programa comercial central + usos complementares. | `STR`, `HCR`, `ROF`, `SGN`, `TEC` | lote amplo; acesso público múltiplo. | `COMPOSITION_FIRST` |
| `TYPE_INSTITUTIONAL_HOSPITAL` | Escala, circulação segregada, infraestrutura técnica e organização de setores excedem clínica pequena. | `BLD_INST_CLINIC_SMALL` | circulação/programa hospitalar e infraestrutura técnica própria. | `STR`, `HCR`, `VCR`, `TEC`, `PRK` | lote amplo; acessos diferenciados. | `NEW_ARCHETYPE_JUSTIFIED` |
| `TYPE_INSTITUTIONAL_MUSEUM` | Exposição, circulação pública e áreas técnicas formam programa diferente de escola pequena. | `BLD_INST_SCHOOL_SMALL` | espaço de exposição + circulação pública controlada. | `HCR`, `FAC`, `TEC`, `SGN` | lote público/institucional; praça pode ser complementar. | `INVESTIGATE` |
| `TYPE_INSTITUTIONAL_CULTURAL_CENTER` | Programa composto pode conter salas, auditório, oficinas e áreas comuns. | `BLD_INST_SCHOOL_SMALL` | conjunto de espaços públicos programáticos. | `HCR`, `STR`, `TEC`, `SGN` | lote institucional; múltiplas relações externas. | `INVESTIGATE` |
| `TYPE_INSTITUTIONAL_THEATER` | Palco, plateia, bastidores e grande vão são restrições morfológicas próprias. | `BLD_INST_CULTURAL_CENTER` | grande espaço de plateia + palco + bastidores. | `STR`, `HCR`, `TEC`, `FAC` | lote amplo; acesso público e técnico separados. | `NEW_ARCHETYPE_JUSTIFIED` |
| `TYPE_INSTITUTIONAL_RELIGIOUS` | Categoria ampla demais: diferentes programas religiosos produzem formas incompatíveis. | nenhum único | ainda indefinido. | depende da subdivisão. | depende do subtipo. | `UNRESOLVED` |
| `TYPE_INDUSTRIAL_FACTORY` | Processo produtivo pode exigir vãos, fluxos e equipamentos específicos. | `BLD_IND_WORKSHOP_SMALL` | envelope produtivo de escala superior. | `STR`, `TEC`, `HCR`, `ROF` | lote industrial; circulação de carga. | `INVESTIGATE` |
| `TYPE_INDUSTRIAL_HEAVY_FACTORY` | Grande escala e processos pesados podem ultrapassar fábrica genérica. | `TYPE_INDUSTRIAL_FACTORY` | grande vão/altura + infraestrutura de processo. | `STR`, `TEC`, `PRK`, `ROF` | lote industrial amplo; acessos de carga. | `INVESTIGATE` |
| `TYPE_INDUSTRIAL_PROCESSING_PLANT` | Fluxo contínuo de processamento e equipamentos integrados podem definir o envelope. | `TYPE_INDUSTRIAL_FACTORY` | organização espacial subordinada ao processo produtivo. | `STR`, `TEC`, `HCR`, `ROF` | lote amplo; fluxos de entrada/saída. | `INVESTIGATE` |
| `TYPE_INDUSTRIAL_LOGISTICS_CENTER` | Docas, grande volume e circulação pesada diferenciam o edifício de pequeno armazém. | `BLD_IND_WAREHOUSE_SMALL` | grande nave logística + docas. | `STR`, `TEC`, `PRK`, `HCR` | lote grande; pátio de manobra obrigatório. | `NEW_ARCHETYPE_JUSTIFIED` |
| `TYPE_AGRICULTURAL_BARN` | Galpão agrícola possui relação funcional com campo e armazenamento/produção rural. | `BLD_IND_WAREHOUSE_SMALL` | dependência de área rural/produção agrícola e envelope aberto/ventilado. | `STR`, `ROF`, `TEC`, `CLM` | lote rural; conexão com `agricultural_field`. | `INVESTIGATE` |
| `TYPE_AGRICULTURAL_STABLE` | Abrigo de animais exige baias, ventilação e espaços externos próprios. | `BLD_AGR_BARN` futuro | programa animal como invariante. | `STR`, `CLM`, `TEC`, `BND` | lote rural; área externa obrigatória. | `NEW_ARCHETYPE_JUSTIFIED` |
| `TYPE_AGRICULTURAL_SILO` | Estrutura vertical especializada, diferente de edifício ocupável convencional. | nenhum atual | geometria de armazenamento vertical. | `STR`, `TEC`, `FND` | lote rural/industrial; acesso técnico. | `NEW_ARCHETYPE_JUSTIFIED` |
| `TYPE_AGRICULTURAL_GREENHOUSE` | Envoltória transparente e relação interior/exterior são fundamentais. | nenhum atual | espaço produtivo protegido por envoltória especializada. | `STR`, `FAC`, `CLM`, `TEC` | lote rural; relação direta com produção. | `NEW_ARCHETYPE_JUSTIFIED` |

---

## 5. Primeira conclusão arquitetural

A matriz revela três grupos diferentes.

### Grupo A — Novos arquétipos com evidência forte

```text
shopping_center
hospital
 theater
logistics_center
stable
silo
greenhouse
```

Esses casos apresentam uma combinação de programa, escala, circulação, estrutura ou relação com o lote que dificilmente deve ser reduzida a uma simples mudança de uso.

**Importante:** `NEW_ARCHETYPE_JUSTIFIED` significa apenas que a lacuna foi considerada suficientemente forte para a próxima fase de especificação. Nenhuma ficha foi criada ainda.

### Grupo B — Candidatos que ainda precisam de prova

```text
tower
dormitory
market
gallery
museum
cultural_center
factory
heavy_factory
processing_plant
barn
```

A próxima etapa deve testar esses casos contra os arquétipos existentes e, principalmente, contra composição + módulos.

### Grupo C — Não devem virar arquétipo automaticamente

```text
religious_building
market_hall
villa
cemetery
```

Esses nomes ainda escondem problemas de modelagem. É mais seguro subdividir o programa ou tratá-lo como composição antes de criar uma identidade monolítica.

---

## 6. Regra especial para escala

Escala não deve produzir uma árvore infinita:

```text
small → medium → large → huge → mega → ...
```

A pergunta correta é:

> A mudança de escala altera o modo como o edifício funciona ou apenas seus valores dimensionais?

Exemplo:

```text
small_warehouse
      ↓ aumento de área
warehouse
      ↓ aumento de área
logistics_center
```

Só o último salto é candidato forte quando aparecem novas exigências de docas, circulação pesada, pátio de manobra e organização logística.

Isso evita criar um arquétipo para cada faixa arbitrária de metragem.

---

## 7. Regra especial para equipamentos especializados

Equipamento técnico não cria arquétipo automaticamente.

```text
warehouse + refrigeration
       ↓
mesmo arquétipo + TEC
```

Mas:

```text
warehouse + docas + grande pátio + circulação pesada
       ↓
possível nova identidade logística
```

Portanto, a distinção é entre **equipamento que modifica o edifício** e **programa que reorganiza o edifício**.

---

## 8. Regra especial para composição

Alguns itens do catálogo devem ser construídos hierarquicamente:

```text
CEMITÉRIO
├── administração
├── capela
├── túmulos
├── caminhos
└── áreas verdes
```

```text
SHOPPING CENTER
├── âncoras
├── lojas
├── circulação
├── estacionamento
└── áreas técnicas
```

A existência de vários elementos não implica que todos devam ser novos arquétipos. O BDB-003 descreve o edifício; a composição deve permanecer em uma camada superior quando apropriado.

---

## 9. Dependências para a próxima etapa

Antes de implementar qualquer novo arquétipo, cada candidato `NEW_ARCHETYPE_JUSTIFIED` deve passar por:

```text
BDB-003-C
   ↓
Ficha morfológica
   ↓
Schema
   ↓
Slots BDB-005
   ↓
Família BDB-006
   ↓
Receita BDB-007
   ↓
Fixture mínimo
   ↓
Validação
```

A criação de uma ficha BDB-003 sem esses elementos é considerada **incompleta**.

---

## 10. Próxima fila de implementação

A fila não representa ranking de importância. Ela representa **dependência arquitetural e capacidade de validar padrões reutilizáveis**.

### Lote C1 — Primeiros arquétipos especializados

1. `hospital`
2. `theater`
3. `logistics_center`
4. `silo`
5. `greenhouse`
6. `stable`

Esses seis casos cobrem padrões distintos: equipamento institucional, grande vão/público, logística pesada e estruturas agrícolas especializadas.

### Lote C2 — Após C1

```text
shopping_center
museum
cultural_center
factory
barn
tower
dormitory
market
gallery
```

A ordem de implementação dos lotes pode ser alterada somente após os resultados de C1, porque C1 deverá revelar quais abstrações do schema, slots e composição são realmente reutilizáveis.

---

## 11. Critério de saída do BDB-003-C

BDB-003-C será considerado concluído quando:

- todos os `NEW_ARCHETYPE_CANDIDATE` relevantes da matriz BDB-003-B estiverem classificados;
- cada candidato forte possuir justificativa morfológica explícita;
- composição estiver separada de arquétipo;
- nenhuma variação climática, cultural, econômica ou estética tiver sido promovida indevidamente;
- a fila de novos arquétipos estiver definida sem declarar implementação inexistente;
- o primeiro lote estiver pronto para especificação individual.

**Decisão normativa:** não ampliar o catálogo funcional enquanto esta etapa não estiver concluída. O gargalo atual é a modelagem morfológica, não a quantidade de nomes disponíveis.
