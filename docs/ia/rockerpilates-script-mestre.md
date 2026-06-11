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
```

Portanto, Resilience4j/Circuit Breaker e `sessionVersion` do aluno devem ser tratados como features concluídas, validadas e mergeadas.

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
- upload de imagem/vídeo
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

Antes da sequência de segurança/produção, o projeto estava estimado em:

```txt
60% a 65%
```

Depois das features concluídas até agora:

```txt
feature/seguranca-rotas-admin-aluno
feature/revisao-cors-env-producao
feature/revisao-secrets-env-producao
feature/revisao-banco-init-backup
feature/revisao-seguranca-producao-final
feature/seguranca-politica-senha
feature/seguranca-rate-limit-login
feature/seguranca-headers-http
```

Estimativa atual realista:

```txt
74% a 78%
```

Motivo:

```txt
- experiência aluno/admin já está funcional em boa parte
- financeiro manual já está implementado em fluxo principal
- documentação de segurança de produção foi criada
- política mínima de senha foi aplicada no backend de usuários
- rate limit no login foi implementado no BFF
- headers HTTP de segurança foram implementados no BFF
- Resilience4j/Circuit Breakers foram implementados no BFF
- fallbacks Feign foram configurados em todos os clients do BFF
- sessionVersion do aluno foi implementado e validado
- CORS/cookies/secrets já estão parametrizados para produção
- banco/init/backup já têm documentação inicial
```

Ainda não está pronto para produção porque faltam:

```txt
- HTTPS real
- domínio real
- firewall/VPS
- banco não exposto
- backup/restauração testados
- revisão segura de upload
- logs mínimos de segurança mais completos
- revisão de duplicidade financeira
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
```

### Pendente antes de produção

```txt
- HTTPS real.
- APP_COOKIE_SECURE=true em produção.
- APP_SECURITY_HSTS_ENABLED=true apenas com HTTPS.
- CORS restrito ao domínio real.
- Firewall/VPS.
- PostgreSQL não exposto publicamente.
- Backup e restauração testados.
- Upload de mídia revisado com segurança.
- Logs mínimos de segurança mais completos.
- Revisão de IDOR/acesso por ID.
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

Resilience4j/Circuit Breaker e `sessionVersion` do aluno já foram concluídos.

Antes de qualquer nova feature, o próximo passo correto é:

```txt
1. Ler docs/ia/rockerpilates-script-mestre.md.
2. Ler docs/seguranca-producao.md.
3. Rodar git status.
4. Confirmar estado atual do projeto.
5. Verificar se a funcionalidade já existe.
6. Confirmar que a alteração não conflita com regras de negócio documentadas.
```

Próximas prioridades possíveis, sem iniciar agora:

```txt
- revisar upload de mídia
- testar backup/restauração
- revisar duplicidade financeira
- revisar IDOR/acesso por ID
- criar política mínima de privacidade/LGPD
- preparar deploy real com HTTPS/domínio/firewall
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

Resilience4j/Circuit Breaker e `sessionVersion` do aluno não são mais próximas prioridades; ambos já foram concluídos, validados e mergeados.

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
- revisar upload de mídia
- testar backup/restauração
- revisar duplicidade financeira em marcar pagamento como pago
- revisar IDOR/acesso por ID
- criar política mínima de privacidade/LGPD
- preparar deploy real com HTTPS/domínio/firewall
```

### Depois

```txt
- revisar upload de mídia
- testar backup/restauração
- revisar duplicidade financeira em marcar pagamento como pago
- revisar IDOR/acesso por ID
- criar política mínima de privacidade/LGPD
- preparar deploy real com HTTPS/domínio/firewall
```

---

## 17. Pontos que NÃO devem ser afirmados ainda

Não afirmar:

```txt
- projeto pronto para produção
- backup restaurado com sucesso
- upload 100% seguro
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
[ ] upload revisado quanto a tipo/tamanho/nome seguro
[ ] logs mínimos de segurança
[ ] rate limit validado em ambiente real
[ ] headers HTTP validados em ambiente real
[ ] senha forte backend validada
[x] sessionVersion para aluno implementado e testado
[ ] revisão de acesso por ID
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
develop atualizado após os PRs #123 e #124.
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
```

Primeiro comando antes de qualquer nova feature:

```powershell
git status
```

Depois, escolher a próxima feature com base nos bloqueadores reais de produção:

```txt
- upload seguro
- backup/restauração testados
- duplicidade financeira
- IDOR/acesso por ID
- política mínima de privacidade/LGPD
- deploy com HTTPS/domínio/firewall
```

