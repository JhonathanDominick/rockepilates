# RockerPilates — Script Mestre Atualizado para Continuação do Projeto

## 0. Instruções obrigatórias para a IA que continuar este projeto

Este é um projeto real para uma cliente real.

Não tratar como projeto de estudo.

Regras obrigatórias:

```txt
1. Não inventar funcionalidades.
2. Não afirmar que algo existe sem ter sido implementado, validado, commitado, mergeado ou mostrado no projeto.
3. Sempre pedir/ver o arquivo real antes de orientar alteração.
4. Sempre informar caminho completo do arquivo.
5. Respeitar a arquitetura atual: Frontend → BFF → Microserviços.
6. O frontend não deve chamar microserviço diretamente.
7. Não misturar refatorações grandes com features pequenas.
8. Não fazer mudanças fora do escopo da feature atual.
9. Validar build/teste manual antes de commit.
10. Não afirmar que existem testes automatizados completos.
11. Não dizer que o projeto está pronto para produção antes de HTTPS, domínio, backup testado, segurança mínima, deploy e testes finais.
12. Não commitar uploads, dumps, backups, arquivos .sql gerados localmente ou dados sensíveis.
13. Não corrigir dados antigos inconsistentes de teste individualmente; eles serão apagados antes da carga oficial.
14. Tratar financeiro com rigor: o sistema registra, calcula e auxilia; a cliente/admin decide manualmente.
15. Não fazer deploy ou configurar produção sem checklist explícito de segurança.
16. Não remover fallbacks locais sem garantir que o Docker local continuará funcionando.
17. Antes de mexer em produção, confirmar domínio, HTTPS, variáveis reais e estratégia de backup.
18. Distinguir sempre: implementado, validado, mergeado, pendente, melhoria futura e trabalho iniciado mas ainda não confirmado.
```

---

## 1. Estado atual real confirmado do Git

Estado mais recente confirmado após as últimas features de segurança:

```txt
Branch: develop
Status: up to date with origin/develop
Working tree: clean
```

Comando confirmado pelo usuário:

```powershell
git status
```

Saída confirmada:

```txt
On branch develop
Your branch is up to date with 'origin/develop'.

nothing to commit, working tree clean
```

Features de segurança/documentação concluídas e mergeadas em `develop`:

```txt
feature/revisao-seguranca-producao-final
feature/seguranca-politica-senha
feature/seguranca-rate-limit-login
feature/seguranca-headers-http
feature/resilience4j-bff
feature/aluno-session-version
feature/seguranca-upload-midia
feature/seguranca-exposicao-servicos
feature/seguranca-autorizacao-idor
feature/seguranca-logout-admin-redefine-senha
```

A feature `feature/seguranca-headers-http` foi commitada com:

```txt
Commit: d53b132
Mensagem: feat(seguranca): adiciona headers de seguranca no BFF
```

Após o PR dessa feature, o usuário confirmou `feito`, e em seguida o `develop` local foi confirmado limpo e sincronizado.

### Atualizações concluídas depois disso

Também foram concluídos e mergeados em `develop`:

```txt
PR #123 — Resilience4j / Circuit Breaker no BFF
- Resilience4j configurado.
- Circuit Breakers habilitados.
- Fallbacks Feign configurados em todos os clients do BFF.
- Testes manuais dos fallbacks realizados.
- Indisponibilidade de serviços tratada com HTTP 503.

PR #124 — sessionVersion do aluno
- Invalidação real de sessão do aluno implementada.
- Tokens antigos são invalidados após troca de senha pelo aluno.
- Tokens antigos são invalidados após redefinição de senha pelo admin.
- Autenticação inválida retorna HTTP 401.
- Testes manuais completos da feature realizados.

PR #125 — upload seguro de mídia
- Upload local restrito a JPG/JPEG/PNG/WebP.
- Limite máximo de 10MB aplicado no frontend, BFF e gerenciador-service.
- MIME, extensão, compatibilidade e magic bytes validados.
- Nome final gerado com UUID e extensão normalizada.
- Path final protegido com normalize().startsWith(uploadPath).
- Upload local de vídeos removido; vídeo futuro será por URL de YouTube não listado.

PR #126 — produção com exposição restrita
- docker-compose.prod.yml criado.
- Portas de postgres, usuarios-service, gerenciador-service e BFF removidas no override de produção.
- Frontend em 3000 permanece apenas como etapa intermediária até Nginx/reverse proxy.

PR #127 — autorização interna do gerenciador-service
- Header X-Internal-Service-Token enviado pelos Feign clients do BFF que chamam o gerenciador-service.
- Chamadas sem token ou com token incorreto são negadas pelo gerenciador-service.
- Token configurado por INTERNAL_SERVICE_TOKEN.

PR #128 — logout após sessão invalidada
- Frontend trata HTTP 401 nas páginas protegidas do aluno.
- Cookie aluno_token antigo é expirado.
- Aluno é redirecionado para /login sem tela de erro.
- Fluxo validado no frontend Docker real na porta 3000.
```

Portanto, Resilience4j/Circuit Breaker, `sessionVersion`, upload seguro, restrição de serviços internos, token interno e logout após sessão invalidada devem ser tratados como concluídos, validados e mergeados.

---

## 2. Objetivo final do projeto

O RockerPilates é uma plataforma profissional para uma cliente professora/administradora de pilates.

O objetivo final é entregar um sistema:

```txt
- hospedado
- seguro
- com domínio real
- com HTTPS
- com banco persistente
- com backup
- com painel administrativo
- com área do aluno
- pronto para uso real da cliente
```

O sistema deve conter:

```txt
- site institucional público
- CMS próprio para editar conteúdo do site
- upload local seguro de imagens
- vídeos futuros por URL de YouTube não listado
- painel administrativo
- gestão de alunos
- cadastro de novos alunos
- importação/cadastro de alunos antigos/retroativos
- gestão de planos
- gestão de assinaturas
- gestão financeira manual assistida
- controle de pagamentos por ciclo
- controle de ausências
- reversão de ausência
- cancelamento de assinatura
- dashboard financeiro
- histórico financeiro administrativo
- área do aluno
- login admin
- login aluno
- perfil do aluno
- histórico financeiro do aluno
- mensagens da professora para o aluno
- troca de senha do aluno
- logout após troca de senha feita pelo próprio aluno
- redefinição de senha do aluno pelo admin
- depoimentos com aprovação administrativa
- deploy com domínio
- HTTPS
- banco persistente
- backup testado
- logs mínimos
- segurança mínima profissional antes de produção
```

### Importante sobre logout após troca/redefinição de senha

Estado confirmado por teste manual:

```txt
Aluno troca a própria senha pelo perfil → logout automático já acontece.
Admin redefine a senha do aluno → tokens antigos do aluno são invalidados por sessionVersion.
```

Conclusão técnica:

```txt
O logout no fluxo do aluno existe e a invalidação real de sessões antigas foi implementada com sessionVersion.
```

Tokens antigos passam a ser rejeitados na validação da sessão do aluno. Autenticação inválida retorna HTTP 401.

---

## 3. Percentual atual estimado

Avaliação atual baseada no código, na documentação e nas features validadas e mergeadas:

```txt
Projeto completo: 76%
Software funcional: aproximadamente 90%
Restante para conclusão total: 24%
```

Leitura correta desses números:

```txt
- Os fluxos centrais de site, CMS, admin, aluno e financeiro estão implementados em grande parte.
- O software funcional está próximo de 90%, considerando telas e regras de negócio existentes.
- O projeto completo está em 76% porque produção exige infraestrutura, operação, segurança final e homologação.
- Os 24% restantes concentram-se principalmente fora das funcionalidades visíveis.
```

Itens já incorporados nessa avaliação:

```txt
- Resilience4j, Circuit Breakers e fallbacks Feign.
- sessionVersion e invalidação real da sessão do aluno.
- upload local seguro de imagens.
- docker-compose.prod.yml com serviços internos sem portas publicadas.
- token interno obrigatório entre BFF e gerenciador-service.
- logout e redirecionamento após sessão antiga invalidada.
```

Ainda não está pronto para produção porque faltam:

```txt
- HTTPS real
- domínio real
- Nginx/reverse proxy
- VPS e firewall
- confirmação prática das portas fechadas no deploy real
- secrets reais fora do Git
- backup/restauração testados
- política uniforme de senha no gerenciador-service
- auditoria da redefinição de senha pelo admin
- idempotência/concorrência financeira
- logs estruturados e observabilidade
- política mínima de privacidade/LGPD
- deploy final e testes finais com cliente
```

---

## 4. Arquitetura atual

Arquitetura obrigatória:

```txt
Frontend Next.js
        ↓
BFF Spring Boot
        ↓
Microserviços Spring Boot
        ↓
PostgreSQL
```

Microserviços conhecidos:

```txt
usuarios-service
gerenciador-service
bff-pilates
frontend/rockepilates-web
postgres
```

O frontend não deve chamar microserviços diretamente.

---

## 5. Stack atual

### Frontend

```txt
Next.js
TypeScript
App Router
Docker
```

Rotas e áreas principais:

```txt
/admin
/admin/login
/admin/alunos
/admin/alunos/novo
/admin/alunos/importar
/admin/financeiro
/admin/depoimentos
/aluno/perfil
/aluno/financeiro
/login
/api/aluno/logout
```

### Backend

```txt
Java 21
Spring Boot 3.2.0
Gradle
Spring Cloud OpenFeign
Resilience4j dependency via Spring Cloud Circuit Breaker
Bucket4j
JWT
BCrypt
PostgreSQL
Docker Compose
```

### Banco

```txt
PostgreSQL 15
Banco usuarios_db
Banco gerenciador_db
```

Credenciais locais conhecidas do ambiente Docker:

```env
POSTGRES_USER=rocker
POSTGRES_PASSWORD=rocker123
POSTGRES_DB=usuarios_db
```

Atenção:

```txt
Essas credenciais são fallback/local. Produção deve usar .env real externo ao repositório.
```

---

## 6. Serviços e portas

Estado esperado em Docker local:

```txt
frontend: porta 3000
bff-pilates: porta 8080
usuarios-service: porta 8081
gerenciador-service: porta 8082
postgres: porta 5432
```

Em produção:

```txt
5432 não deve ficar público
8080/8081/8082 não devem ficar públicos se houver Nginx reverse proxy
somente 80/443 devem ser públicos para web
SSH deve ser protegido
```

---

## 7. Regras de negócio financeiras confirmadas

A regra de negócio definida para o RockerPilates é:

```txt
A cliente controla manualmente o financeiro.
O sistema apenas auxilia, registra, calcula e alerta.
O sistema não toma decisões sozinho como gerar cobranças bancárias reais ou cancelar assinaturas automaticamente.
```

Planos:

```txt
MENSAL
SEMESTRAL
ANUAL
```

Entidades principais:

```txt
Aluno
Plano
Assinatura
Pagamento
```

Status de pagamento:

```txt
PAGO
PENDENTE
ATRASADO
AUSENTE
CANCELADO
```

Regras importantes:

```txt
- Novo aluno só inicia se pagar o primeiro ciclo.
- Primeiro pagamento é obrigatório no cadastro de novo aluno pelo admin.
- O primeiro ciclo é criado como PAGO.
- O próximo ciclo é criado automaticamente como PENDENTE.
- Pagamentos futuros podem ser marcados como pagos antecipadamente pelo histórico.
- O botão "Marcar pago" no histórico deve ser mantido para pagamentos futuros/pendentes.
- O botão principal da lista deve continuar seguro e só aparecer quando fizer sentido no ciclo atual.
- Dados inconsistentes antigos são dados de teste e serão apagados antes da carga oficial.
```

Importação retroativa:

```txt
- Usada para alunos antigos.
- Deve conter ciclos financeiros contínuos.
- Primeiro ciclo financeiro deve ser PAGO.
- Importação retroativa não deve gerar pagamentos futuros indevidos.
- Mês atual pode ser PENDENTE ou PAGO conforme regra já ajustada.
```

Melhoria futura já registrada:

```txt
Evoluir Pagamento para ter competencia, referencia e descricao.
Hoje o sistema usa dataVencimento como referência.
```

---

## 8. Funcionalidades principais já existentes

### Site público/CMS

Já existe:

```txt
- CMS básico
- edição de textos/configurações
- upload de mídia
- depoimentos
- aprovação/desaprovação de depoimentos pelo admin
- mídia servida via uploads
- proxy Next para upload
- integração com BFF/gerenciador-service
```

Feature relacionada concluída:

```txt
feature/revisao-cms-site-depoimentos
```

### Área admin

Já existe:

```txt
- login admin
- cookie admin_token
- painel administrativo
- listagem de alunos
- paginação de alunos
- filtros server-side para alunos
- cadastro de novo aluno
- primeiro pagamento obrigatório
- importação retroativa
- financeiro admin
- dashboard financeiro básico
- histórico financeiro administrativo
- redefinição de senha do aluno pelo admin
- gestão de depoimentos
- CMS
```

### Área aluno

Já existe:

```txt
- login aluno
- cookie aluno_token
- perfil do aluno
- resumo financeiro
- histórico financeiro
- filtros de histórico
- paginação
- troca de senha pelo aluno
- logout automático após troca de senha feita pelo próprio aluno
```

### Segurança e produção

Já existe:

```txt
- cookies HttpOnly
- SameSite=Lax
- Secure controlado por APP_COOKIE_SECURE
- CORS controlado por APP_CORS_ALLOWED_ORIGINS
- parametrização de secrets/URLs no docker-compose
- .env.example
- documentação de backup
- init script do banco gerenciador_db
- documentação de segurança de produção
- política mínima de senha no usuarios-service
- rate limit no login com Bucket4j
- headers HTTP de segurança no BFF
- Resilience4j e Circuit Breakers no BFF
- fallbacks configurados em todos os Feign clients
- sessionVersion e invalidação real da sessão do aluno
- upload local restrito a JPG/JPEG/PNG/WebP com limite de 10MB
- validação de MIME, extensão, magic bytes, UUID e path seguro no upload
- upload local de vídeos removido; vídeos futuros serão URLs de YouTube não listado
- docker-compose.prod.yml sem portas publicadas para os serviços internos
- X-Internal-Service-Token obrigatório no gerenciador-service
- logout automático e redirecionamento após sessão antiga invalidada
```

---

## 9. Últimas features concluídas e estado

### 9.1 feature/revisao-seguranca-producao-final

Status:

```txt
Implementada, commitada, enviada, PR criado e mergeado em develop.
```

Commit:

```txt
873947a
```

Mensagem:

```txt
docs(seguranca): documenta requisitos de producao do projeto
```

Arquivo criado:

```txt
docs/seguranca-producao.md
```

Conteúdo:

```txt
- controles atuais de segurança
- bloqueadores de produção
- melhorias futuras
- foco exclusivamente no projeto RockerPilates
```

### 9.2 feature/seguranca-politica-senha

Status:

```txt
Implementada, validada, enviada, PR criado e mergeado em develop.
Branch remota apagada.
```

Alterações confirmadas:

```txt
- BCrypt já estava configurado no usuarios-service.
- CreateUsuarioRequest passou a validar senha mínima.
- UpdateSenhaRequest passou a validar nova senha mínima.
- Regra: mínimo de 8 caracteres, pelo menos uma letra e um número.
- TesteSenha.java foi removido de src/main/java.
```

Build validado:

```powershell
.\gradlew.bat :backend:usuarios-service:bootJar --no-daemon
```

Resultado:

```txt
BUILD SUCCESSFUL
```

### 9.3 feature/seguranca-rate-limit-login

Status:

```txt
Implementada, validada, enviada, PR criado e mergeado em develop.
Branch remota apagada.
```

Alterações confirmadas:

```txt
- Bucket4j adicionado ao BFF.
- Dependência: com.bucket4j:bucket4j_jdk17-core:8.19.0.
- Criado LoginRateLimitService.
- Aplicado rate limit no login admin.
- Aplicado rate limit no login aluno.
- Regra: 5 tentativas por minuto por IP.
- Separado por tipo de login: admin e aluno.
- HTTP 429 quando excede o limite.
```

Rotas protegidas:

```txt
POST /bff/usuarios/login
POST /bff/alunos/login
```

Build validado:

```powershell
.\gradlew.bat :backend:bff-pilates:bootJar --no-daemon
```

Resultado:

```txt
BUILD SUCCESSFUL
```

Observação:

```txt
O rate limit está em memória no BFF. Adequado para primeira produção com instância única.
Se houver múltiplas instâncias no futuro, evoluir para armazenamento distribuído.
```

### 9.4 feature/seguranca-headers-http

Status:

```txt
Implementada, build validado, commitada, enviada, PR criado e mergeado em develop.
```

Commit:

```txt
d53b132
```

Mensagem:

```txt
feat(seguranca): adiciona headers de seguranca no BFF
```

Arquivo criado:

```txt
backend/bff-pilates/src/main/java/com/rockepilates/bff/security/SecurityHeadersFilter.java
```

Alterações:

```txt
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: no-referrer
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Content-Security-Policy básica
- HSTS opcional via APP_SECURITY_HSTS_ENABLED
```

`.env.example` atualizado com:

```env
APP_SECURITY_HSTS_ENABLED=false
```

Build validado:

```powershell
.\gradlew.bat :backend:bff-pilates:bootJar --no-daemon
```

Resultado:

```txt
BUILD SUCCESSFUL
```

Observação:

```txt
HSTS deve ficar false/local e só ser ativado em produção com HTTPS real.
```

### 9.5 PR #125 — upload seguro de mídia

Status:

```txt
Implementada, validada manualmente, commitada e mergeada em develop.
```

Estado final:

```txt
- Upload local aceita somente JPG/JPEG/PNG/WebP.
- Limite máximo de 10MB.
- Arquivo vazio é recusado.
- MIME e extensão precisam ser permitidos e compatíveis.
- Magic bytes de JPEG, PNG e WebP são validados.
- SVG, GIF, AVIF, vídeos e executáveis são recusados.
- Nome final usa UUID e extensão normalizada.
- Path final usa normalize().startsWith(uploadPath).
- Upload local de vídeo foi removido do CMS.
- Vídeos futuros serão integrados por URL de YouTube não listado.
```

### 9.6 PR #126 — docker-compose de produção restrito

Status:

```txt
Implementada, validada, commitada e mergeada em develop.
```

Estado final:

```txt
- docker-compose.yml continua sendo a base de desenvolvimento.
- docker-compose.prod.yml remove ports de postgres, usuarios-service, gerenciador-service e bff-pilates.
- Frontend em 3000 ainda é etapa intermediária até Nginx/reverse proxy.
- Deploy final deve expor publicamente somente 80/443.
```

### 9.7 PR #127 — token interno do gerenciador-service

Status:

```txt
Implementada, testada manualmente, commitada e mergeada em develop.
```

Estado final:

```txt
- Feign clients do BFF que chamam o gerenciador-service enviam X-Internal-Service-Token.
- gerenciador-service nega chamadas sem token ou com token incorreto.
- INTERNAL_SERVICE_TOKEN é parametrizado por ambiente.
- O controle complementa, mas não substitui, firewall e portas fechadas.
```

### 9.8 PR #128 — logout após sessão invalidada

Status:

```txt
Implementada, validada no Docker real da porta 3000, commitada e mergeada em develop.
```

Estado final:

```txt
- Token antigo do aluno retorna HTTP 401 no BFF.
- /aluno/perfil e /aluno/financeiro tratam sessão inválida.
- Rota server-side expira aluno_token.
- Aluno é redirecionado para /login.
- Não há tela de erro nem loop de redirecionamento.
- Login com a nova senha continua funcionando.
```

---

## 10. Estado atual de segurança

### Concluído

```txt
- Middleware admin/aluno corrigido.
- Remoção de middleware duplicado.
- Cookies HttpOnly/SameSite.
- Secure parametrizado por APP_COOKIE_SECURE.
- CORS parametrizado por APP_CORS_ALLOWED_ORIGINS.
- Secrets e URLs parametrizados.
- Backup documentado.
- Segurança de produção documentada.
- BCrypt confirmado no usuarios-service.
- Política mínima de senha implementada no usuarios-service.
- Rate limit no login implementado no BFF.
- Headers HTTP de segurança implementados no BFF.
- Resilience4j/Circuit Breakers implementados e validados.
- Fallbacks Feign configurados em todos os clients do BFF.
- sessionVersion implementado e validado para o aluno.
- Upload local seguro de imagens implementado e validado.
- Upload local de vídeos removido do CMS.
- docker-compose.prod.yml criado para remover portas dos serviços internos.
- Token interno obrigatório entre BFF e gerenciador-service.
- Logout e redirecionamento do aluno após sessão invalidada.
```

### Pendente antes de produção

```txt
- HTTPS real.
- APP_COOKIE_SECURE=true em produção.
- APP_SECURITY_HSTS_ENABLED=true apenas com HTTPS.
- CORS restrito ao domínio real.
- Firewall/VPS.
- Aplicação prática do docker-compose.prod.yml no servidor real.
- Backup e restauração testados.
- Logs mínimos de segurança mais completos.
- Auditoria da redefinição de senha pelo admin.
- Política de senha uniforme no gerenciador-service.
- Revisão de duplicidade financeira.
- Política mínima de privacidade/LGPD.
- Deploy real.
- Teste final com cliente.
```

---

## 11. Situação específica: troca e redefinição de senha do aluno

### Teste manual confirmado

```txt
Aluno troca senha pelo próprio perfil:
- logout automático acontece.
- sessionVersion incrementa.
- token antigo passa a retornar HTTP 401.
```

### Teste manual confirmado

```txt
Admin redefine senha de aluno:
- sessionVersion incrementa.
- token antigo do aluno passa a retornar HTTP 401.
```

### Diagnóstico técnico

O JWT do aluno é gerado no `gerenciador-service` por:

```txt
backend/gerenciador-service/src/main/java/com/rockepilates/gerenciador/security/JwtAlunoService.java
```

Com claims:

```java
claims.put("alunoId", alunoId);
claims.put("tipo", "ALUNO");
claims.put("sessionVersion", sessionVersion);
```

O BFF valida a `sessionVersion` do token contra o `gerenciador-service` nas rotas protegidas do aluno.

Se a sessão estiver inválida, o BFF retorna HTTP 401.

Se o `gerenciador-service` estiver indisponível durante a validação, o BFF nega a sessão e retorna HTTP 503.

### Solução implementada

Foi implementado `sessionVersion` para aluno no PR #124.

Fluxo atual:

```txt
1. Aluno tem sessionVersion no banco.
2. Login gera JWT com sessionVersion atual.
3. BFF compara sessionVersion do token com sessionVersion do banco via gerenciador-service.
4. Quando aluno troca senha, sessionVersion incrementa.
5. Quando admin redefine senha do aluno, sessionVersion incrementa.
6. JWT antigo passa a ser inválido na próxima requisição.
```

### Atenção

Essa feature está implementada, validada manualmente e mergeada.

Não tratar mais como pendência de logout visual. A validação real de sessão do aluno já existe.

---

## 12. Resilience4j / Circuit Breaker — estado atual

### O que existe de fato

No `backend/bff-pilates/build.gradle.kts` existe:

```kotlin
implementation("org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j")
```

No `backend/bff-pilates/src/main/resources/application.yml`, o Feign Circuit Breaker foi habilitado:

```yaml
spring:
  cloud:
    openfeign:
      circuitbreaker:
        enabled: true
```

e bloco `resilience4j` com instâncias para clients Feign.

### Estado final

PR #123 concluído e mergeado.

```txt
- Resilience4j configurado.
- Circuit Breakers habilitados.
- Fallbacks Feign configurados em todos os clients do BFF.
- Testes manuais dos fallbacks realizados.
- Indisponibilidade de serviços tratada com HTTP 503.
```

Portanto, a feature de Resilience4j/Circuit Breaker deve ser considerada:

```txt
CONCLUÍDA / VALIDADA / MERGEADA
```

### Clients Feign conhecidos no BFF

```txt
UsuariosClient
AlunoClient
GerenciadorClient
FinanceiroClient
DepoimentoClient
DashboardFinanceiroClient
```

Todos possuem fallback configurado.

Fallbacks conhecidos:

```txt
UsuariosClientFallback
AlunoClientFallback
GerenciadorClientFallback
FinanceiroClientFallback
DepoimentoClientFallback
DashboardFinanceiroClientFallback
```

Operações críticas não retornam sucesso falso. Fallbacks sensíveis lançam erro de serviço indisponível.

---

## 13. Resilience4j / Circuit Breaker — configuração final validada

Arquivo:

```txt
backend/bff-pilates/src/main/resources/application.yml
```

Estado final validado no PR #123:

```txt
- Feign Circuit Breaker habilitado.
- Instâncias Resilience4j configuradas para os clients do BFF.
- dashboardFinanceiroClient corrigido com permittedNumberOfCallsInHalfOpenState numérico.
- Build do BFF passou.
- Testes manuais confirmaram fallback acionado.
- Indisponibilidade de serviços retorna HTTP 503.
```

---

## 14. Próximo passo recomendado agora

Resilience4j/Circuit Breaker, `sessionVersion`, upload seguro, compose restrito, token interno e logout após sessão invalidada já foram concluídos.

Antes de qualquer nova feature, o próximo passo correto é:

```txt
1. Ler docs/ia/rockerpilates-script-mestre.md.
2. Ler docs/seguranca-producao.md.
3. Rodar git status.
4. Confirmar estado atual do projeto.
5. Verificar se a funcionalidade já existe.
6. Confirmar que a alteração não conflita com regras de negócio documentadas.
```

Próximas prioridades, sem iniciar agora:

```txt
- auditar a redefinição de senha do aluno pelo admin
- unificar a política de senha no gerenciador-service
- reforçar idempotência e concorrência financeira
- preparar Nginx, HTTPS, VPS e firewall
- testar backup/restauração
- implementar observabilidade e logs estruturados
- criar política mínima de privacidade/LGPD
- finalizar documentação e homologação com a cliente
```

---

## 15. Comandos úteis para atualizar Docker local com jars novos

Quando quiser subir as atualizações para Docker:

```powershell
git checkout develop
git pull origin develop
git status
```

Gerar jars:

```powershell
.\gradlew.bat :backend:usuarios-service:bootJar --no-daemon
.\gradlew.bat :backend:gerenciador-service:bootJar --no-daemon
.\gradlew.bat :backend:bff-pilates:bootJar --no-daemon
```

Rebuild completo:

```powershell
docker compose down
docker compose build --no-cache
docker compose up -d
docker ps
```

Rebuild parcial:

```powershell
docker compose build usuarios-service gerenciador-service bff-pilates frontend
docker compose up -d usuarios-service gerenciador-service bff-pilates frontend
```

Logs:

```powershell
docker compose logs -f usuarios-service
docker compose logs -f gerenciador-service
docker compose logs -f bff-pilates
docker compose logs -f frontend
```

---

## 16. Próximas prioridades do projeto

### Prioridade imediata

Resilience4j/Circuit Breaker, `sessionVersion`, upload seguro, compose de produção, token interno e logout após sessão invalidada não são mais próximas prioridades; todos já foram concluídos, validados e mergeados.

Antes de iniciar qualquer nova feature:

```txt
1. Confirmar git status.
2. Confirmar branch atual.
3. Verificar se o develop local está atualizado.
4. Relacionar a nova feature com docs/seguranca-producao.md.
5. Evitar refatorações oportunistas.
```

### Próxima prioridade de segurança real

```txt
- auditar a redefinição de senha pelo admin
- unificar a política de senha no gerenciador-service
- reforçar idempotência/concorrência financeira
- preparar Nginx/HTTPS/VPS/firewall
- testar backup/restauração
- implementar observabilidade/logs estruturados
- criar política mínima de privacidade/LGPD
- finalizar documentação e testes com a cliente
```

### Depois

```txt
- testes automatizados dos fluxos críticos
- healthcheck consolidado
- correlationId entre BFF e serviços
- análise de dependências e imagens Docker
- evolução futura do storage local de mídia
```

---

## 17. Pontos que NÃO devem ser afirmados ainda

Não afirmar:

```txt
- projeto pronto para produção
- backup restaurado com sucesso
- upload elimina todos os riscos possíveis
- LGPD completa
- testes automatizados completos
```

Só afirmar quando houver evidência real:

```txt
build passou
teste manual validado
commit feito
PR mergeado
develop limpo
```

---

## 18. Checklist real de liberação para produção

Antes de produção real:

```txt
[ ] HTTPS configurado
[ ] domínio real configurado
[ ] APP_COOKIE_SECURE=true em produção
[ ] APP_SECURITY_HSTS_ENABLED=true somente com HTTPS
[ ] APP_CORS_ALLOWED_ORIGINS com domínio real
[ ] PostgreSQL não exposto publicamente
[ ] firewall configurado
[ ] banco com volume persistente
[ ] backups testados
[ ] restauração testada
[ ] uploads com volume persistente
[x] upload revisado quanto a tipo/tamanho/nome seguro
[x] upload local restrito a JPG/JPEG/PNG/WebP e 10MB
[x] vídeos locais removidos do upload
[ ] logs mínimos de segurança
[ ] rate limit validado em ambiente real
[ ] headers HTTP validados em ambiente real
[ ] política de senha uniforme no gerenciador-service
[x] sessionVersion para aluno implementado e testado
[x] docker-compose.prod.yml remove portas dos serviços internos
[x] token interno obrigatório no gerenciador-service
[x] logout após sessão antiga invalidada
[ ] auditoria da redefinição de senha pelo admin
[ ] revisão de duplicidade financeira
[ ] política mínima de privacidade
[ ] variáveis reais fora do repositório
[ ] build final frontend/backend
[ ] teste final com cliente
```

---

## 19. Resumo final do ponto exato de continuação

O projeto está avançado e com várias melhorias reais de segurança já mergeadas em `develop`.

O ponto exato agora é:

```txt
develop atualizado após os PRs #123, #124, #125, #126, #127 e #128.
```

Features concluídas neste ponto:

```txt
PR #123:
- Resilience4j
- Circuit Breakers
- Fallbacks Feign em todos os clients
- Testes manuais dos fallbacks
- HTTP 503 para indisponibilidade dos serviços

PR #124:
- sessionVersion
- invalidação real de sessão do aluno
- invalidação após troca de senha
- invalidação após redefinição de senha pelo admin
- HTTP 401 para autenticação inválida
- testes manuais completos da feature

PR #125:
- upload seguro de imagens
- limite de 10MB
- MIME, extensão, magic bytes, UUID e path seguro
- upload local de vídeo removido

PR #126:
- docker-compose.prod.yml
- portas dos serviços internos removidas no override de produção

PR #127:
- X-Internal-Service-Token entre BFF e gerenciador-service
- chamadas internas sem token são negadas

PR #128:
- logout após sessão invalidada
- cookie aluno_token removido
- redirecionamento para /login validado no Docker real
```

Primeiro comando antes de qualquer nova feature:

```powershell
git status
```

Depois, escolher a próxima feature com base nos bloqueadores reais de produção:

```txt
- auditoria de redefinição de senha pelo admin
- política de senha no gerenciador-service
- backup/restauração testados
- idempotência/concorrência financeira
- Nginx/HTTPS/VPS/firewall
- observabilidade/logs estruturados
- política mínima de privacidade/LGPD
- documentação final e testes com a cliente
```

---

## 20. Percentual consolidado e riscos atuais

Percentual atual registrado:

```txt
Projeto completo: 76%
Software funcional: aproximadamente 90%
Restante: 24%
```

Riscos que ainda precisam ser tratados antes da produção real:

```txt
- Produção iniciada sem secrets reais e fortes fora do Git.
- Portas internas expostas caso o override de produção ou o firewall sejam aplicados incorretamente.
- Tráfego e cookies inseguros enquanto não houver HTTPS real.
- Backup existente apenas como procedimento documentado, sem restauração validada.
- Possível concorrência ou duplicidade em operações financeiras simultâneas.
- Logs insuficientes e ainda sem estrutura/correlationId abrangente.
- Ausência de suíte de testes automatizados para os fluxos críticos.
- CORS, cookies Secure e HSTS dependem da configuração correta do domínio real.
- Política de senha do gerenciador-service ainda não está uniforme com o usuarios-service.
- Redefinição de senha pelo admin ainda precisa de auditoria final de segurança.
```

O projeto não deve ser classificado como pronto para produção enquanto esses bloqueadores não forem tratados e testados no ambiente real.

