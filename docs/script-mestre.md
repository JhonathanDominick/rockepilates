# RockerPilates - Script Mestre

## Estado confirmado em 31/07/2026

Repositorio: `JhonathanDominick/rockepilates`.

Checkout local usado para continuidade: `C:\rocker\rockepilates`.

Estado Git antes desta etapa:

- `develop` local sincronizado com `origin/develop` no commit `61113f2`;
- `origin/main` no commit `34d0f62`, merge do `develop` publicado em 10/07/2026;
- sem diferenca de arquivos entre `develop` local e `origin/main` no inicio da retomada;
- branch de implementacao desta etapa: `codex/v1-landing-seufisio-harness`.

## Produto da v1

A v1 do RockerPilates e:

- `/` landing page publica do studio;
- `/admin/login` login privado da cliente;
- `/admin` entrada privada que redireciona para a area administrativa ativa da v1;
- `/admin/site` CMS para editar a landing publica;
- `/admin/depoimentos` moderacao de depoimentos enviados pelo formulario publico.

A v1 nao e o sistema proprio completo de gestao.
As areas de alunos, financeiro, dashboard, portal do aluno e cadastro de aluno ficam preservadas no codigo para futuro, mas bloqueadas/ocultas em `APP_MODE=v1`.
Depoimentos fazem parte da v1: visitantes podem enviar depoimentos pela landing, a cliente aprova/desaprova em `/admin/depoimentos`, e somente depoimentos aprovados aparecem na pagina publica.

## Regra principal da pagina publica

A pagina publica e voltada para pessoas que querem praticar Pilates com a Evelyn.

A pagina publica nao e a pagina do curso de formacao de professores.
RockerAcademy permanece como negocio separado, mantido no Wix, e aparece apenas como link secundario externo.

A pagina publica tambem nao deve colocar o visitante no sistema de gestao proprio que esta sendo desenvolvido.
Nesta v1, os botoes publicos levam aos canais que a cliente ja usa hoje.

A interface publica deve falar como RockerPilates. Nomes de plataformas terceiras so devem aparecer se forem realmente uteis para o visitante; por padrao, use textos como "agenda online", "app para clientes" e "agendar aula".

Nao criar novas secoes publicas, como vitrine de midias, sem pedido explicito.

## Links e configuracoes

Defaults tecnicos:

- Agenda online atual: `https://agenda.seufisio.com.br/xxee-rocker-pilates-studio`
- RockerAcademy: `https://www.rockeracademy.com/`
- Google Maps / avaliacoes: `https://maps.app.goo.gl/orVpSiQqMdMPGam98`

Chaves CMS publicas usadas pela landing:

- `home.*`
- `external.seufisio.agendaUrl`
- `external.seufisio.appAndroidUrl`
- `external.seufisio.appIosUrl`
- `external.rockeracademy.url`
- `external.maps.reviewsUrl`
- `external.whatsappUrl`

Links externos renderizados devem abrir em nova aba com `rel="noopener noreferrer"` e aceitar somente `http` ou `https`.

## CMS de midia

O CMS edita imagens da landing nos campos existentes.
A imagem do app para clientes e editavel pela chave `home.app.image`.
O arquivo `frontend/rockepilates-web/public/img/app.jpg` e somente fallback quando o CMS ainda nao salvou outra imagem.

Campos `IMAGE` aceitam upload local, caminho publico como `/img/app.jpg`, caminho de upload como `/uploads/...` ou URL `http/https`.
Campos `VIDEO`, quando usados em campos existentes, aceitam link ou ID de video do YouTube e renderizam embed seguro via `youtube-nocookie.com`.

## O que fica preservado para migracao futura

Nao remover as rotas e funcionalidades ja construidas:

- `/admin/alunos`
- `/admin/financeiro`
- `/admin/dashboard`
- `/login`
- `/cadastro-aluno`
- `/aluno/perfil`
- `/aluno/financeiro`
- servicos backend de alunos, financeiro, depoimentos e autenticacao.

Essas areas continuam como base do sistema proprio que a cliente podera adotar depois.
A regra da v1 e nao promove-las e bloquea-las em `APP_MODE=v1`.
Excecao: `/admin/depoimentos` e os endpoints necessarios ao fluxo de depoimentos fazem parte da v1.

## Arquitetura obrigatoria

```text
Next.js -> bff-pilates -> usuarios-service / gerenciador-service -> PostgreSQL
```

O frontend nao deve chamar microservicos internos diretamente.

## Docker local

A stack local deve subir por Docker Compose em maquina limpa, sem exigir JAR gerado manualmente no host.

No Compose local, `DB_PASSWORD` e a senha usada pelo container Postgres devem ser a mesma fonte de verdade.
Nao manter `POSTGRES_PASSWORD` e `DB_PASSWORD` divergentes no `.env`.

Comandos esperados:

```powershell
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

Validacoes minimas:

```powershell
Invoke-WebRequest http://localhost:3000/ -UseBasicParsing
Invoke-WebRequest http://localhost:8080/bff/health -UseBasicParsing
```

Servicos e portas locais:

- frontend: `3000`
- bff-pilates: `8080`
- usuarios-service: `8081`
- gerenciador-service: `8082`
- postgres: `5432`

Em producao, usar override como `docker-compose.prod.yml` ou proxy para nao expor Postgres, usuarios-service e gerenciador-service publicamente.

## Evidencia obrigatoria para concluir tarefa

Uma tarefa so pode ser marcada como concluida quando houver evidencia real:

- branch usada;
- arquivos alterados;
- build/testes executados;
- validacao manual relevante;
- resultado do Docker quando aplicavel;
- status Git limpo ou lista clara de pendencias.

Se alguma validacao nao puder rodar, registrar o motivo sem afirmar sucesso.

## Bloqueadores de producao real

Producao real com dados da cliente continua bloqueada ate concluir:

- dominio e HTTPS reais;
- `APP_COOKIE_SECURE=true` em producao;
- CORS restrito ao dominio real;
- firewall e PostgreSQL nao exposto publicamente;
- backup e restauracao testados;
- logs minimos e politica de privacidade;
- checklist de seguranca em `docs/seguranca-producao.md`.
