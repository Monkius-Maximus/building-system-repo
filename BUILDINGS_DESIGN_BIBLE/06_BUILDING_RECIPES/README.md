# Receitas Regionais

Esta pasta contém o contrato e os dados do BDB-007.

Contratos:

```text
00_CORE/schemas/regional-recipe.schema.json
00_CORE/schemas/bdb007-validation.schema.json
```

## Estrutura

```text
contexts/   perfis localizados com proveniência por grupo de campos
recipes/    receitas com escopo, família, prevalência e lacunas explícitas
```

## Catálogo inicial

| Receita | Tipo | Estado | Uso regional geral |
|---|---|---|---:|
| Recife residencial moderno | `documented_corpus` | `partial` | bloqueado |

A receita inicial prova a correspondência localizada, mas não declara distribuição municipal. Ela somente pode ser usada quando o chamador solicita explicitamente o corpus documentado.

Clima semelhante não basta para ativar uma receita. A âncora na hierarquia, país, subdivisão, sistema e código de localidade, período e variante devem coincidir.
