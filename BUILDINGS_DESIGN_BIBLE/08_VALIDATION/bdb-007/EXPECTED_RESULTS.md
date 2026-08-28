# BDB-007 — Resultados esperados

## Caso 1 — corpus residencial moderno do Recife

A correspondência usa um fixture de lote descendente da âncora municipal. Deve ser positiva porque a cadeia `parent_context_id`, país, subdivisão, sistema e código de localidade herdados, período e variante interna coincidem de forma explícita.

O resultado mantém duas famílias candidatas:

```text
shaded_ventilated_edge
protected_courtyard
```

Isso não cria percentuais. A seleção permanece `deferred_missing_regional_prevalence`, pois as fontes atuais não oferecem denominador municipal.

Quatro recursos pesquisados ficam adiados porque não há candidato semanticamente equivalente no catálogo:

```text
telha sobre laje
peitoril ventilado
revestimento cerâmico de fachada
tela vazada com sombra e ventilação
```

O sistema não pode substituí-los silenciosamente por cobertura, janela, superfície ou brise genérico.

## Caso 2 — fixture tropical neutro

A correspondência deve ser rejeitada mesmo que o clima seja `tropical_humid`.

Motivos esperados:

```text
contexto não autorizado
geografia ausente
período incompatível
variante cultural neutra
```

Nenhuma família ou recurso adiado pode atravessar a trava de escopo.

## Invariantes comprovadas

1. clima semelhante não implica região;
2. corpus publicado não implica prevalência municipal;
3. ocorrência documentada não implica presença em todo edifício;
4. falta de componente não autoriza aproximação semântica;
5. regras de família não reaplicam diretivas consumidas no BDB-005;
6. nenhum peso regional existe sem denominador pesquisado.
