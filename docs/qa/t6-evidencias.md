# T6 · Antes/depois do Sonar e teste de fumaça

Issue: [#10](https://github.com/igorSeberino/app.ludens/issues/10) · Responsável: @RenatoColin (QA) · Revisor: @Diegonessler
Atende: R1, R5 · Plano: `docs/plano/00-visao-geral.md` §6 (T6)

## 1. SonarQube Cloud: antes × depois

Projeto: [igorSeberino_app.ludens](https://sonarcloud.io/project/overview?id=igorSeberino_app.ludens).
Antes = primeira análise da `master` (27/11/2026 16:58, `10a9cea`, análise automática, sem
cobertura). Depois = análise da `master` após o merge da T3 (27/11/2026 18:58, `af8e0fe`).

| Métrica | Antes | Depois | Variação |
| --- | --- | --- | --- |
| Bugs | 0 | 0 | = |
| Vulnerabilidades | 14 | 0 | −14 |
| Security hotspots (revisados) | 0 (100 %) | 0 (100 %) | = |
| Code smells | 1 | 0 | −1 |
| Duplicação | 0,5 % | 0,4 % | −0,1 p.p. |
| Cobertura | sem dado | 73,5 % (API 85,3 % · web 54,5 %) | passou a ser medida |
| Linhas de código | 16.119 | 12.402 | −3.717 |
| Quality Gate | não calculado | **Failed** (só cobertura do código novo) | |

Por app, no "depois": `apps/api/src` e `apps/web/src` com 0 bugs, 0 vulnerabilidades e 0 code
smells; duplicação de 0,0 % na API e 0,6 % na web. Nenhuma issue aberta no projeto.

Quality Gate: confiabilidade, segurança, manutenibilidade, duplicação e hotspots passam. Reprova
só a cobertura do código novo da `master`: 77,4 %, abaixo dos 80 % do gate padrão (o PR da T3
isolado passou com 82,6 %). Fica como débito: subir a cobertura da web ou ajustar o gate.

## 2. Teste de fumaça em https://ludens-web.onrender.com

### Primeira rodada (deploy da `master` após o merge de #12 e #22)

| Passo | Resultado | Data | Observação |
| --- | --- | --- | --- |
| API no ar (`GET https://ludens-api.onrender.com/health`) | ok | 27/11/2026 | 200; 23 s na primeira chamada (Render free acordando) |
| Web após o deploy dos merges | ok | 27/11/2026 | 503 "Application loading" por alguns segundos durante o redeploy, depois 200 |
| Web no ar (página inicial com o cartaz) | ok | 27/11/2026 | 200; lista 4 espetáculos |
| Cadastro | ok | 27/11/2026 | Conta de teste "QA Teste Fumaca T6" criada em `/registro`; entra logada na home |
| Login | ok (parcial) | 27/11/2026 | Sessão aberta logo após o cadastro; sair e entrar de novo com e-mail e senha ainda não foi refeito à parte |
| Busca | ok | 27/11/2026 | Filtro de gênero "Drama" retorna 2 espetáculos (Vestido de Noiva, O Pagador de Promessas); detalhe abre com 3 sessões |
| Reserva | ok | 27/11/2026 | Vestido de Noiva, 05/12/2026 20:00, 1 inteira (R$ 40,00); abre o checkout com prazo de 15 min |
| Compra simulada | ok | 27/11/2026 | "Simular aprovação" → "Compra confirmada"; ingresso DEMO emitido em Minhas compras |
| Cancelamento | ok | 27/11/2026 | "Cancelar pedido" com motivo → pedido e ingresso cancelados, reembolso simulado de 100 % (R$ 40,00) |

### Rodada final (27/11/2026, deploy de `af8e0fe`, após a T3)

| Passo | Resultado | Observação |
| --- | --- | --- |
| API e web no ar | ok | `/health` 200 e home 200 |
| Login | ok | Sessão da conta de teste continuava ativa |
| Busca | ok | Filtro "Drama" mostra só os dramas |
| Reserva | ok | A Menina e o Vento, 07/12/2026 20:00, 1 inteira (R$ 40,00) |
| Compra simulada | ok | "Compra confirmada" e ingresso DEMO emitido |
| Cancelamento | ok | Pedido e ingresso cancelados, reembolso simulado de 100 % |

## 3. Revisão dos PRs de T1–T5

| PR | Tarefa | Autor | Revisão |
| --- | --- | --- | --- |
| [#12](https://github.com/igorSeberino/app.ludens/pull/12) | T2 · deploy no Render e plano | @igorSeberino | aprovado e mergeado |
| [#21](https://github.com/igorSeberino/app.ludens/pull/21) | T5 · documentação | @gabrielcarvallho | aprovado e mergeado |
| [#22](https://github.com/igorSeberino/app.ludens/pull/22) | T2 · acordar a API junto com a web | @igorSeberino | aprovado e mergeado |
| [#23](https://github.com/igorSeberino/app.ludens/pull/23) | T4 · DT-12 e DT-13 | @Diegonessler | aprovado e mergeado |
| [#25](https://github.com/igorSeberino/app.ludens/pull/25) | T1 · SonarQube Cloud | @igorSeberino | aprovado e mergeado |
| [#26](https://github.com/igorSeberino/app.ludens/pull/26) | T2 · acordar a API pelo navegador | @igorSeberino | mergeado sem revisão |
| [#27](https://github.com/igorSeberino/app.ludens/pull/27) | T3 · backend no Sonar | @adrian-cesar | aprovado e mergeado |
