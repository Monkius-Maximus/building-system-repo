# BDB-003-B — Matriz de Normalização do Catálogo Funcional

**Projeto:** Buildings Design Bible  
**Versão:** 0.1  
**Status:** 🟡 Auditoria inicial; decisões futuras ainda dependem de validação  
**Dependências:** `BDB-003_ARQUETIPOS_UNIVERSAIS.md`, `BUILDING_TYPE_CATALOG.md`, `00_CORE/schemas/archetype.schema.json`

---

## 1. Objetivo

Esta matriz é a etapa de controle entre o catálogo funcional e a biblioteca de arquétipos.

Ela existe para impedir que cada nome de edifício do catálogo seja transformado automaticamente em um novo arquétipo. O objetivo é descobrir **qual distinção o gerador realmente precisa representar**.

A decisão segue a cadeia:

```text
CATÁLOGO FUNCIONAL
      ↓
NORMALIZAÇÃO
      ↓
ARQUÉTIPO EXISTENTE / REUSO / NOVO CANDIDATO / COMPOSIÇÃO
      ↓
BDB-003
      ↓
BDB-005 → BDB-006 → BDB-007
```

O schema de arquétipo já exige um contrato morfológico e funcional explícito; portanto, esta matriz não cria fichas por antecipação. O `archetype_id` continua separado do identificador funcional do catálogo.

---

## 2. Estados de decisão

| Estado | Significado |
|---|---|
| `EXISTING_ARCHETYPE` | O catálogo já possui correspondência explícita com um arquétipo existente. |
| `REUSE_ARCHETYPE` | O item possui função própria, mas sua diferença não exige uma nova morfologia; deve reutilizar um arquétipo existente com uso, módulos, receita ou composição apropriados. |
| `NEW_ARCHETYPE_CANDIDATE` | Há indícios de uma morfologia/programa que pode exigir arquétipo próprio, mas isso ainda não foi especificado e validado. |
| `COMPOSITION` | O item é melhor tratado como conjunto de edifícios/estruturas ou composição urbana, não como uma única ficha monolítica. |
| `CONTEXT_VARIATION` | A diferença é principalmente contextual, material, cultural, climática, econômica ou de aparência; não cria tipo funcional novo. |
| `UNRESOLVED` | A distinção ainda não pode ser decidida com segurança a partir dos contratos atuais. |

### Regra de segurança

`NEW_ARCHETYPE_CANDIDATE` **não significa arquétipo implementado**. Significa apenas que o item deve entrar na fila de investigação do BDB-003.

---

## 3. Critério de decisão

Para cada item, aplicar nesta ordem:

```text
1. A função muda de forma relevante?
2. A ocupação muda?
3. A volumetria/implantação muda de forma estrutural?
4. Os limites de um arquétipo existente continuam suficientes?
5. A diferença pode ser expressa por módulos, receita, composição ou contexto?
6. Somente se as respostas anteriores não resolverem → candidato a novo arquétipo.
```

A pergunta operacional é:

> **Se eu reutilizar o arquétipo existente, o gerador ainda consegue produzir um edifício coerente e validável?**

Se sim, não se cria outro arquétipo apenas porque o nome do uso é diferente.

---

## 4. Matriz residencial

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_RESIDENTIAL_DETACHED_HOUSE` | Casa isolada | `EXISTING_ARCHETYPE` | `BLD_RES_HOUSE_DETACHED` | Correspondência direta com o núcleo BDB-003. |
| `TYPE_RESIDENTIAL_ATTACHED_HOUSE` | Casa geminada/adossada | `EXISTING_ARCHETYPE` | `BLD_RES_HOUSE_ATTACHED` | Parede compartilhada é parte da identidade do arquétipo. |
| `TYPE_RESIDENTIAL_WALKUP_APARTMENT` | Apartamento sem elevador | `EXISTING_ARCHETYPE` | `BLD_RES_APARTMENT_WALKUP` | Unidade empilhada e circulação coletiva já definem o arquétipo. |
| `TYPE_RESIDENTIAL_MIDRISE_APARTMENT` | Edifício residencial médio | `EXISTING_ARCHETYPE` | `BLD_RES_APARTMENT_MIDRISE` | Correspondência direta com o núcleo BDB-003. |
| `TYPE_RESIDENTIAL_TOWER` | Torre residencial | `NEW_ARCHETYPE_CANDIDATE` | — | A relação torre/pódio, circulação vertical e implantação vertical pode ultrapassar os limites dos arquétipos residenciais atuais. |
| `TYPE_RESIDENTIAL_VILLA` | Conjunto/vila residencial | `COMPOSITION` | — | O conceito pode representar várias unidades e espaços compartilhados; precisa ser distinguido de uma única casa antes de virar arquétipo. |
| `TYPE_RESIDENTIAL_DORMITORY` | Residência coletiva/dormitório | `NEW_ARCHETYPE_CANDIDATE` | — | Programa coletivo pode exigir regras de ocupação, circulação e espaços comuns que não cabem naturalmente em casa ou apartamento atual. |

---

## 5. Matriz comercial

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_COMMERCIAL_STREET_SHOP` | Loja de rua | `EXISTING_ARCHETYPE` | `BLD_COM_STREET_SHOP` | Correspondência direta. |
| `TYPE_COMMERCIAL_CORNER_SHOP` | Loja de esquina | `EXISTING_ARCHETYPE` | `BLD_COM_CORNER_SHOP` | A esquina é uma condição de implantação já representada. |
| `TYPE_COMMERCIAL_ROADSIDE_BUSINESS` | Comércio veicular | `EXISTING_ARCHETYPE` | `BLD_COM_ROADSIDE_BUSINESS` | A relação com acesso e estacionamento veicular já é definidora. |
| `TYPE_COMMERCIAL_SUPERMARKET` | Supermercado | `REUSE_ARCHETYPE` | `BLD_COM_STREET_SHOP` ou outro após validação | O uso diferencia o programa interno; ainda não há evidência suficiente para declarar uma morfologia própria. Deve ser testado contra o porte e o lote. |
| `TYPE_COMMERCIAL_MARKET` | Mercado/mercado coberto | `NEW_ARCHETYPE_CANDIDATE` | — | Mercado pode assumir pavilhão, galeria ou conjunto de bancas; a forma mínima ainda precisa ser definida. |
| `TYPE_COMMERCIAL_SHOPPING_CENTER` | Centro comercial | `NEW_ARCHETYPE_CANDIDATE` | — | Escala, circulação e composição de múltiplas unidades provavelmente exigem contrato próprio. |
| `TYPE_COMMERCIAL_GALLERY` | Galeria comercial | `NEW_ARCHETYPE_CANDIDATE` | — | Espaço comercial interno com circulação comum altera a morfologia em relação à loja de rua. |
| `TYPE_COMMERCIAL_BANK` | Agência bancária | `REUSE_ARCHETYPE` | `BLD_COM_STREET_SHOP` ou `BLD_COM_CORNER_SHOP` | A função bancária não é, por si só, prova de uma nova morfologia. Segurança e equipamentos devem entrar como módulos/regras quando necessário. |
| `TYPE_COMMERCIAL_RESTAURANT` | Restaurante | `REUSE_ARCHETYPE` | `BLD_COM_STREET_SHOP` / `BLD_COM_ROADSIDE_BUSINESS` | Programa comercial com requisitos internos adicionais; validar se o envelope continua sendo o mesmo. |
| `TYPE_COMMERCIAL_CAFE` | Café/lanchonete | `REUSE_ARCHETYPE` | `BLD_COM_STREET_SHOP` | Diferença primariamente de atividade e programa. |
| `TYPE_COMMERCIAL_BAKERY` | Padaria | `REUSE_ARCHETYPE` | `BLD_COM_STREET_SHOP` / `BLD_COM_ROADSIDE_BUSINESS` | Atividade específica não justifica novo arquétipo sem necessidade morfológica comprovada. |

---

## 6. Matriz de uso misto

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_MIXED_SHOP_HOUSE` | Comércio + residência | `EXISTING_ARCHETYPE` | `BLD_MIX_SHOP_HOUSE` | Uso vertical combinado já é identidade do arquétipo. |
| `TYPE_MIXED_URBAN_BLOCK` | Bloco urbano combinado | `EXISTING_ARCHETYPE` | `BLD_MIX_URBAN_BLOCK` | Composição de bloco já possui tratamento específico. |
| `TYPE_MIXED_APARTMENT_RETAIL` | Residencial + comércio | `REUSE_ARCHETYPE` | `BLD_MIX_SHOP_HOUSE` como ponto de partida | Deve ser testado se o mesmo contrato de uso misto cobre o porte residencial pretendido; não criar duplicação antes do teste. |
| `TYPE_MIXED_OFFICE_RETAIL` | Escritório + comércio | `REUSE_ARCHETYPE` | `BLD_MIX_SHOP_HOUSE` ou `BLD_MIX_URBAN_BLOCK` | O uso do pavimento superior muda, mas o princípio de empilhamento de usos pode ser reutilizado. |
| `TYPE_MIXED_MARKET_HALL` | Mercado + outros usos | `NEW_ARCHETYPE_CANDIDATE` | — | Pode combinar grande espaço público, circulação interna e usos complementares; requer definição morfológica. |

---

## 7. Matriz institucional e serviços públicos

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_INSTITUTIONAL_SCHOOL` | Escola pequena | `EXISTING_ARCHETYPE` | `BLD_INST_SCHOOL_SMALL` | Correspondência direta. |
| `TYPE_INSTITUTIONAL_CLINIC` | Clínica pequena | `EXISTING_ARCHETYPE` | `BLD_INST_CLINIC_SMALL` | Correspondência direta. |
| `TYPE_INSTITUTIONAL_DAYCARE` | Creche | `REUSE_ARCHETYPE` | `BLD_INST_SCHOOL_SMALL` como candidato de reuso | Programa educacional/infantil pode compartilhar lógica de pavilhão institucional; validar necessidades específicas antes de criar outro arquétipo. |
| `TYPE_INSTITUTIONAL_HOSPITAL` | Hospital | `NEW_ARCHETYPE_CANDIDATE` | — | Escala, circulação, infraestrutura técnica e programa diferenciam o edifício de uma clínica pequena. |
| `TYPE_INSTITUTIONAL_LIBRARY` | Biblioteca | `REUSE_ARCHETYPE` | `BLD_INST_SCHOOL_SMALL` como referência | Função pública não demonstra sozinha nova morfologia; testar programa, vão e circulação. |
| `TYPE_INSTITUTIONAL_MUSEUM` | Museu | `NEW_ARCHETYPE_CANDIDATE` | — | Programa de exposição, circulação pública e áreas técnicas pode exigir volumetria específica. |
| `TYPE_INSTITUTIONAL_CULTURAL_CENTER` | Centro cultural | `NEW_ARCHETYPE_CANDIDATE` | — | Programa composto e espaços de reunião/apresentação podem ultrapassar escola pequena. |
| `TYPE_INSTITUTIONAL_THEATER` | Teatro | `NEW_ARCHETYPE_CANDIDATE` | — | Grande vão, plateia, palco e bastidores constituem restrições morfológicas próprias. |
| `TYPE_INSTITUTIONAL_CINEMA` | Cinema | `REUSE_ARCHETYPE` | `BLD_INST_CULTURAL_CENTER` quando existir | A decisão depende de o sistema tratar cinema como unidade de exibição dentro de composição maior ou edifício independente. |
| `TYPE_INSTITUTIONAL_RELIGIOUS` | Edificação religiosa | `NEW_ARCHETYPE_CANDIDATE` | — | A categoria abrange programas e volumetrias muito diferentes; primeiro deve ser subdividida por necessidade do gerador. |
| `TYPE_INSTITUTIONAL_CEMETERY` | Cemitério | `COMPOSITION` | — | Predomina como espaço/terreno com múltiplos elementos, não como um único edifício. |

---

## 8. Matriz industrial

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_INDUSTRIAL_WORKSHOP` | Oficina | `EXISTING_ARCHETYPE` | `BLD_IND_WORKSHOP_SMALL` | Correspondência direta. |
| `TYPE_INDUSTRIAL_SMALL_WAREHOUSE` | Pequeno armazém | `EXISTING_ARCHETYPE` | `BLD_IND_WAREHOUSE_SMALL` | Correspondência direta. |
| `TYPE_INDUSTRIAL_FACTORY` | Fábrica | `NEW_ARCHETYPE_CANDIDATE` | — | Processo produtivo, áreas técnicas e escala podem exigir contrato próprio. |
| `TYPE_INDUSTRIAL_HEAVY_FACTORY` | Indústria de grande porte | `NEW_ARCHETYPE_CANDIDATE` | — | Escala e vãos estruturais são potencialmente incompatíveis com pequeno armazém/oficina. |
| `TYPE_INDUSTRIAL_PROCESSING_PLANT` | Unidade de processamento | `NEW_ARCHETYPE_CANDIDATE` | — | Equipamentos e fluxo produtivo podem definir uma morfologia própria. |
| `TYPE_INDUSTRIAL_COLD_STORAGE` | Armazém refrigerado | `REUSE_ARCHETYPE` | `BLD_IND_WAREHOUSE_SMALL` ou futuro armazém de maior escala | Refrigeração é inicialmente tratada como requisito técnico, não como forma. O porte deve decidir a necessidade de novo arquétipo. |
| `TYPE_INDUSTRIAL_LOGISTICS_CENTER` | Centro logístico | `NEW_ARCHETYPE_CANDIDATE` | — | Escala, docas e circulação de veículos pesados justificam investigação morfológica própria. |

---

## 9. Matriz agrícola/rural

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_AGRICULTURAL_RURAL_HOUSE` | Casa rural | `EXISTING_ARCHETYPE` | `BLD_RES_HOUSE_RURAL` | Correspondência direta. |
| `TYPE_AGRICULTURAL_FARMHOUSE` | Casa-sede rural | `REUSE_ARCHETYPE` | `BLD_RES_HOUSE_RURAL` | Pode ser uma variação de programa da casa rural; anexos e produção devem ser composição/módulos até prova em contrário. |
| `TYPE_AGRICULTURAL_BARN` | Celeiro/galpão agrícola | `NEW_ARCHETYPE_CANDIDATE` | — | Função e envelope podem reutilizar princípios do galpão industrial, mas a relação com produção rural precisa ser formalizada. |
| `TYPE_AGRICULTURAL_STABLE` | Estábulo | `NEW_ARCHETYPE_CANDIDATE` | — | Exige programa de animais, ventilação, compartimentação e área externa específica. |
| `TYPE_AGRICULTURAL_SILO` | Silo | `NEW_ARCHETYPE_CANDIDATE` | — | É uma estrutura especializada, com geometria e função próprias. |
| `TYPE_AGRICULTURAL_GREENHOUSE` | Estufa | `NEW_ARCHETYPE_CANDIDATE` | — | Envoltória e relação interior/exterior são diferentes das famílias edilícias atuais. |
| `TYPE_AGRICULTURAL_MILL` | Moinho | `UNRESOLVED` | — | Pode representar equipamento/edifício especializado e depende de tecnologia e período; requer decisão antes de arquétipo. |

---

## 10. Matriz de hospedagem

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_HOSPITALITY_HOTEL` | Hotel | `NEW_ARCHETYPE_CANDIDATE` | — | Múltiplas unidades de hospedagem, circulação e áreas comuns podem exigir contrato próprio. |
| `TYPE_HOSPITALITY_INN` | Pousada | `REUSE_ARCHETYPE` | `BLD_RES_HOUSE_DETACHED` / futuro arquétipo de hospedagem | Pode ser pequena e residencial em forma, mas o sistema deve confirmar se o programa de hóspedes cabe no arquétipo. |
| `TYPE_HOSPITALITY_HOSTEL` | Hostel | `REUSE_ARCHETYPE` | `BLD_RES_HOUSE_DETACHED` / apartamento | O programa de ocupação coletiva é a principal diferença; pode exigir novo arquétipo se circulação e unidades comuns excederem os atuais. |
| `TYPE_HOSPITALITY_RESORT` | Resort | `COMPOSITION` | — | Melhor modelado inicialmente como conjunto de edifícios e espaços externos, não como uma única forma. |
| `TYPE_HOSPITALITY_MOTEL` | Motel | `NEW_ARCHETYPE_CANDIDATE` | — | Relação direta entre unidades, estacionamento e acesso veicular pode justificar morfologia própria. |

---

## 11. Matriz de transporte

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_TRANSPORT_RAIL_STATION` | Estação ferroviária | `NEW_ARCHETYPE_CANDIDATE` | — | Edificação depende de plataforma, circulação de passageiros e interface com infraestrutura linear. |
| `TYPE_TRANSPORT_METRO_STATION` | Estação de metrô | `NEW_ARCHETYPE_CANDIDATE` | — | Relação subterrânea/elevada, acessos e circulação vertical são estruturais. |
| `TYPE_TRANSPORT_BUS_TERMINAL` | Terminal rodoviário | `NEW_ARCHETYPE_CANDIDATE` | — | Fluxo de veículos e passageiros exige programa e implantação específicos. |
| `TYPE_TRANSPORT_AIRPORT` | Aeroporto | `COMPOSITION` | — | Deve ser tratado como sistema composto por terminais, pistas, pátios e infraestrutura. |
| `TYPE_TRANSPORT_PORT` | Porto | `COMPOSITION` | — | Conjunto de cais, pátios, armazéns e infraestrutura; não é adequadamente reduzido a uma única ficha. |
| `TYPE_TRANSPORT_MARINA` | Marina | `COMPOSITION` | — | Predomina como conjunto de infraestrutura costeira e edifícios auxiliares. |
| `TYPE_TRANSPORT_PARKING_STRUCTURE` | Garagem/estacionamento estruturado | `NEW_ARCHETYPE_CANDIDATE` | — | Vãos, rampas e circulação veicular vertical são definidores. |

---

## 12. Matriz de segurança e emergência

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_SECURITY_POLICE_STATION` | Delegacia/posto policial | `NEW_ARCHETYPE_CANDIDATE` | — | Programa restrito, atendimento público e áreas operacionais podem exigir combinação própria. |
| `TYPE_SECURITY_FIRE_STATION` | Corpo de bombeiros | `NEW_ARCHETYPE_CANDIDATE` | — | Garagens de viaturas e saída rápida são elementos funcionais estruturais. |
| `TYPE_SECURITY_BARRACKS` | Quartel | `COMPOSITION` | — | Pode ser conjunto de alojamento, administração, treinamento e apoio; precisa de composição antes de um arquétipo monolítico. |
| `TYPE_SECURITY_PRISON` | Unidade prisional | `NEW_ARCHETYPE_CANDIDATE` | — | Segurança perimetral, controle de acesso e organização interna são parte da morfologia funcional. |

---

## 13. Matriz de infraestrutura e utilidades

| ID funcional | Subtipo | Decisão | Arquétipo | Justificativa |
|---|---|---|---|---|
| `TYPE_INFRASTRUCTURE_POWER_SUBSTATION` | Subestação elétrica | `NEW_ARCHETYPE_CANDIDATE` | — | Equipamentos externos e áreas técnicas são parte do programa. |
| `TYPE_INFRASTRUCTURE_WATER_TREATMENT` | Estação de tratamento de água | `COMPOSITION` | — | Conjunto de tanques, edifícios técnicos e infraestrutura de processo. |
| `TYPE_INFRASTRUCTURE_WASTEWATER_PLANT` | Tratamento de esgoto | `COMPOSITION` | — | Predomina como instalação composta. |
| `TYPE_INFRASTRUCTURE_PUMP_STATION` | Estação de bombeamento | `NEW_ARCHETYPE_CANDIDATE` | — | Pode ser pequena, mas possui equipamento técnico como condição central. |
| `TYPE_INFRASTRUCTURE_WATER_RESERVOIR` | Reservatório | `NEW_ARCHETYPE_CANDIDATE` | — | Estrutura especializada; não deve ser forçada em arquétipos edilícios convencionais. |
| `TYPE_INFRASTRUCTURE_TELECOM` | Instalação de telecomunicações | `UNRESOLVED` | — | O catálogo mistura instalações muito diferentes; precisa distinguir torre, abrigo técnico e central quando o gerador precisar dessas diferenças. |

---

## 14. Resultado da auditoria

### 14.1 Núcleo confirmado

Os itens abaixo já possuem correspondência explícita no catálogo e no conjunto atual de arquétipos:

```text
BLD_RES_HOUSE_DETACHED
BLD_RES_HOUSE_ATTACHED
BLD_RES_HOUSE_RURAL
BLD_RES_APARTMENT_WALKUP
BLD_RES_APARTMENT_MIDRISE
BLD_COM_STREET_SHOP
BLD_COM_CORNER_SHOP
BLD_COM_ROADSIDE_BUSINESS
BLD_MIX_SHOP_HOUSE
BLD_MIX_URBAN_BLOCK
BLD_IND_WORKSHOP_SMALL
BLD_IND_WAREHOUSE_SMALL
BLD_INST_SCHOOL_SMALL
BLD_INST_CLINIC_SMALL
```

A existência dessas fichas foi verificada no repositório. A matriz não altera seus contratos nesta etapa.

### 14.2 Candidatos que merecem investigação primeiro

A fila inicial não deve ser simplesmente a lista de todos os itens `futuro`. A prioridade deve considerar quanto cada arquétipo desbloqueia outros tipos.

Fila proposta para a próxima análise:

```text
P0 — Torre residencial
P0 — Edifício de hospedagem simples
P0 — Galpão agrícola
P0 — Fábrica/galpão produtivo
P0 — Centro logístico
P1 — Escola/creche como família institucional compartilhada
P1 — Hospital
P1 — Estação de transporte
P1 — Garagem estruturada
P2 — Mercado/galeria comercial
P2 — Edificação religiosa
P2 — Estufa/silo/estábulo
P3 — Infraestruturas compostas
```

**Importante:** `P0/P1/P2/P3` são prioridades de investigação de engenharia, não avaliação de importância dos edifícios no mundo real.

---

## 15. O que não devemos fazer agora

Não devemos, nesta etapa:

- criar uma ficha BDB-003 para cada linha `futuro`;
- criar arquétipos separados para restaurante, café e padaria apenas pelo nome da atividade;
- criar arquétipos separados por clima, país, cultura, riqueza ou material;
- transformar conjuntos como aeroporto, porto ou resort em um único edifício sem resolver composição;
- inventar slots ou módulos BDB-005 para justificar um novo arquétipo;
- marcar candidatos como `validated` antes de existir validação.

---

## 16. Próxima etapa obrigatória

A próxima etapa é **BDB-003-C — Matriz de Lacunas Morfológicas**.

Ela deve pegar apenas os itens `NEW_ARCHETYPE_CANDIDATE` e responder, para cada um:

```text
1. Qual invariante não é representável pelos arquétipos existentes?
2. Qual restrição morfológica exige contrato próprio?
3. Quais slots BDB-005 seriam obrigatórios?
4. O item pode ser composição de arquétipos existentes?
5. Qual arquétipo existente seria o limite de escalonamento mais próximo?
6. O novo arquétipo desbloqueia quais outros tipos do catálogo?
```

Somente depois dessa matriz devemos escrever novas fichas BDB-003.

---

## 17. Princípio de encerramento

> **Não criamos uma entidade porque ela existe no mundo real. Criamos uma entidade quando o gerador precisa distingui-la para produzir um resultado diferente, coerente e validável.**

Esta matriz transforma esse princípio em uma etapa auditável do pipeline do Buildings Design Bible.
