# BDB-002 — Diferenças esperadas nos casos de validação

**Status:** 🟡 Hipóteses para inspeção visual
**Arquétipo mantido nos dois casos:** `BLD_RES_HOUSE_DETACHED`

O objetivo não é prescrever duas casas finais. O teste verifica se o sistema consegue deslocar uma mesma receita sem perder seu arquétipo.

## Variáveis mantidas constantes

```text
uso principal
arquétipo
matriz cultural de teste
período contemporâneo
tecnologia mass_produced
```

## Variáveis alteradas

```text
clima
densidade
riqueza
infraestrutura
desenvolvimento
topografia
hidrografia
riscos
```

## Caso 001 — Tropical úmido, urbano médio, renda média

Resultados probabilísticos esperados:

- maior peso para beirais e proteção de aberturas;
- drenagem explícita obrigatória;
- maior possibilidade de ventilação cruzada;
- maior proporção de aberturas dentro dos limites do arquétipo;
- preferência por materiais e montagens tolerantes à umidade;
- implantação mais compacta devido à densidade e ao valor do solo;
- menor recuo e maior continuidade com a rua;
- possibilidade de equipamentos e redes urbanas padrão;
- alerta de maresia e tempestade sem transformar o clima em estilo cultural.

O teste não exige cobertura inclinada. Uma cobertura plana continua possível quando possuir drenagem e compatibilidade suficientes.

## Caso 002 — Semiárido, urbano baixo, baixa renda

Resultados probabilísticos esperados:

- maior peso para sombra de aberturas e espaços externos;
- maior preferência por volumes compactos;
- possibilidade de massa térmica quando compatível;
- maior peso para armazenamento privado de água;
- paisagismo de baixa demanda hídrica;
- lote menos comprimido pela densidade;
- materiais e acabamentos limitados por orçamento, sem impor degradação;
- maior chance de ampliação gradual, ainda não implementada;
- infraestrutura privada simples quando a rede urbana não fornecer o serviço.

O teste não exige pátio, parede espessa ou uma paleta cultural específica.

## Diferenças que não devem ocorrer automaticamente

- trocar o arquétipo;
- atribuir beleza ou feiura pela riqueza;
- inserir símbolos culturais sem matriz correspondente;
- tratar todo edifício tropical como idêntico;
- tratar todo edifício semiárido como vernacular;
- degradar automaticamente o caso de baixa renda;
- inserir infraestrutura pública avançada apenas porque um lote possui riqueza elevada;
- remover restrições estruturais para satisfazer preferência estética.

## Resultado mínimo para aprovação

Uma implementação preliminar será aprovada quando:

1. gerar dez variações por caso;
2. manter todos os resultados dentro do arquétipo;
3. apresentar diferenças estatísticas nos alvos previstos;
4. produzir ao menos uma alternativa válida não estereotipada em cada caso;
5. registrar as regras responsáveis por cada escolha;
6. repetir exatamente os resultados com as mesmas seeds;
7. falhar de modo explícito quando regras incompatíveis forem injetadas.
