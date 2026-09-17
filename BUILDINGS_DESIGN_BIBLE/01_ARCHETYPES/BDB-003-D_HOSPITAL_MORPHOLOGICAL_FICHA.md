# BDB-003-D — Ficha Morfológica do Arquétipo Hospital

**Projeto:** Buildings Design Bible  
**Versão:** 0.1  
**Status:** 🟡 Hipótese estruturada; aguardando validação do pipeline  
**Dependências:** `BDB-003-C_MORPHOLOGICAL_GAP_MATRIX.md`, `00_CORE/schemas/archetype.schema.json`, BDB-005

---

## 1. Objetivo

Especificar o primeiro candidato forte identificado pela matriz BDB-003-C: `TYPE_INSTITUTIONAL_HOSPITAL`.

A ficha testa se um hospital pode ser distinguido da `BLD_INS_CLINIC_SMALL` por invariantes morfológicas e funcionais, sem introduzir campos específicos fora do contrato vigente.

O resultado desta etapa é uma **hipótese de arquétipo**, não uma afirmação de que toda construção hospitalar do mundo possui a mesma forma.

---

## 2. Evidência para separação

A matriz BDB-003-C identificou quatro diferenças relevantes em relação à clínica pequena:

1. **setorização:** o programa pode conter múltiplos setores funcionalmente distintos;
2. **circulação:** os fluxos internos deixam de ser adequadamente representados pelo modelo mínimo de espera + atendimento;
3. **infraestrutura:** a infraestrutura técnica deixa de ser apenas apoio local e passa a ser um requisito contínuo do edifício;
4. **escala vertical e horizontal:** a organização pode exigir múltiplos pavimentos e volumes compostos.

Essas diferenças podem alterar a forma de implantação, a organização volumétrica, a circulação e os requisitos de lote. Portanto, o caso é adequado para testar um novo arquétipo.

---

## 3. Identidade morfológica

O hospital é tratado como um **edifício institucional de saúde unitário**, potencialmente composto por vários setores e volumes.

### Invariantes principais

- acesso público principal sem barreiras;
- unidade institucional única;
- circulação interna estruturada;
- infraestrutura técnica própria;
- possibilidade de atendimento e permanência de pacientes;
- organização compatível com programa composto ou segmentado;
- relação de lote que admite áreas de acesso, estacionamento e serviço.

### Não são invariantes

- estilo arquitetônico;
- material específico;
- clima;
- cultura;
- riqueza;
- país ou cidade;
- cor;
- idade aparente;
- linguagem de fachada.

Esses fatores continuam pertencendo às camadas posteriores do sistema.

---

## 4. Morfologia proposta

A primeira hipótese aceita:

- 1–12 pavimentos;
- preferência por 3–6 pavimentos;
- volumes `pavilion`, `linear`, `slab`, `courtyard`, `cluster` e `compound` entre as soluções possíveis;
- plantas retangulares, em L, T, U, pátio ou irregulares;
- complexidade preferencial `composite` ou `segmented`;
- implantação predominantemente isolada ou com recuos, mas sem proibir outras relações urbanas compatíveis.

A presença de muitos pavimentos **não** cria automaticamente o arquétipo. O limite de escala é apenas parte da hipótese; a separação é justificada pela organização programática.

---

## 5. Relação com BDB-005

A ficha usa somente categorias de slots já presentes no contrato atual.

### Obrigatórios

`FND`, `STR`, `WAL`, `FAC`, `ROF`, `DOR`, `WIN`, `HCR`, `SGN`, `TEC`

### Opcionais

`VCR`, `CLM`, `BND`, `PRK`, `ORN`

A ficha **não inventa módulos hospitalares específicos** nesta etapa. Isso é deliberado: primeiro validamos a abstração do arquétipo; depois verificamos se o catálogo BDB-005 possui candidatos suficientes para consumi-la.

---

## 6. Relação com BDB-006 e BDB-007

Esta entrega não cria família arquitetônica nem receita regional.

A sequência é:

```text
BDB-003-C
   ↓
BDB-003-D — Hospital
   ↓
archetype.schema.json
   ↓
BDB-005 — módulos e encaixes
   ↓
BDB-006 — família arquitetônica
   ↓
BDB-007 — receita regional
```

Uma família posterior poderá alterar linguagem, composição e prevalência sem alterar a identidade funcional do arquétipo.

Uma receita regional posterior poderá introduzir contexto geográfico e histórico sem transformar essas características em invariantes do hospital.

---

## 7. Escalonamento

A clínica pequena já declara hospital como destino quando a morfologia ultrapassa seu envelope ou quando surge internação permanente.

A nova ficha mantém a clínica como referência de reclassificação apenas para casos em que o programa efetivo volte a caber no envelope da clínica. Isso evita usar área isoladamente como critério de classificação.

Ainda não há um arquétipo superior aprovado para hospitais de complexidade excepcional. Portanto, esta ficha não inventa um destino de escalonamento adicional.

---

## 8. Critério de aceitação desta etapa

O hospital poderá sair de `hypothesis` somente depois que:

1. o JSON validar contra `archetype.schema.json`;
2. as categorias de slots forem compatíveis com BDB-005;
3. os invariantes forem verificáveis pelo pipeline existente;
4. não houver dependência de campos ausentes no schema;
5. a montagem mínima puder ser avaliada sem criar módulos fictícios;
6. a distinção em relação à clínica pequena continuar justificável após o teste vertical.

Até então, `BLD_INS_HOSPITAL` permanece uma hipótese formalizada, não um arquétipo plenamente validado.

---

## 9. Resultado esperado

O principal resultado deste documento não é simplesmente adicionar “hospital” ao catálogo. É provar se o sistema consegue representar um programa institucional mais complexo **sem quebrar a separação entre arquétipo, módulo, família e receita**.

Se o teste revelar uma limitação, a correção deverá ocorrer no contrato que possui a responsabilidade correspondente, e não como exceção específica do hospital.
