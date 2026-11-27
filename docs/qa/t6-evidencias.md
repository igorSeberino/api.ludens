# T6 · Antes/depois do Sonar e teste de fumaça

Issue: [#10](https://github.com/igorSeberino/app.ludens/issues/10) · Responsável: @RenatoColin (QA) · Revisor: @Diegonessler
Atende: R1, R5 · Plano: `docs/plano/00-visao-geral.md` §6 (T6)

## 1. SonarQube Cloud: antes × depois

Antes = primeira análise da `master` (linha de base da T1). Depois = última análise da `master`.

| Métrica | Antes (T1) | Depois | Variação |
| --- | --- | --- | --- |
| Bugs | _pendente_ | _pendente_ | |
| Vulnerabilidades | _pendente_ | _pendente_ | |
| Security hotspots | _pendente_ | _pendente_ | |
| Code smells | _pendente_ | _pendente_ | |
| Duplicação (%) | _pendente_ | _pendente_ | |
| Cobertura (%) | _pendente_ | _pendente_ | |
| Quality Gate | _pendente_ | _pendente_ | |

Situação em 27/11/2026: ainda não há projeto do ludens no SonarQube Cloud
(`api/components/search_projects?filter=query=ludens` → 0 resultados). A tabela depende da T1
([#5](https://github.com/igorSeberino/app.ludens/issues/5)) para o "antes" e da T3/T4
([#7](https://github.com/igorSeberino/app.ludens/issues/7), [#8](https://github.com/igorSeberino/app.ludens/issues/8)) para o "depois".

## 2. Teste de fumaça em https://ludens-web.onrender.com

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

Ambiente testado: deploy da `master` após o merge de #12 e #22.

## 3. Revisão dos PRs de T1–T5

| PR | Tarefa | Autor | Revisão |
| --- | --- | --- | --- |
| [#12](https://github.com/igorSeberino/app.ludens/pull/12) | T2 · deploy no Render e plano | @igorSeberino | aprovado e mergeado |
| [#21](https://github.com/igorSeberino/app.ludens/pull/21) | T5 · documentação | @gabrielcarvallho | aprovado e mergeado |
| [#22](https://github.com/igorSeberino/app.ludens/pull/22) | T2 · acordar a API junto com a web | @igorSeberino | aprovado e mergeado |
| [#23](https://github.com/igorSeberino/app.ludens/pull/23) | T4 · DT-12 e DT-13 | @Diegonessler | aprovado |
| _pendente_ | T1 · SonarQube Cloud | @igorSeberino | |
| _pendente_ | T3 · backend no Sonar | | |
| _pendente_ | T4 · apontamentos do Sonar no frontend | @Diegonessler | |
