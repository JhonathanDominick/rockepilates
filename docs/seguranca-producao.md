# Segurança de Produção — RockerPilates

## 1. Objetivo

Este documento registra o estado atual de segurança do projeto RockerPilates e define os requisitos mínimos para liberar o sistema em produção com dados reais da cliente.

O RockerPilates é um sistema desenvolvido para uma empresa pequena, com poucos usuários, mas que manipula informações importantes:

* dados pessoais de alunos;
* login de administrador;
* login de aluno;
* histórico financeiro manual;
* informações de assinatura/plano;
* conteúdo administrativo do site;
* upload de imagens;
* dados operacionais da professora/cliente.

Por isso, o projeto precisa ter uma base de segurança profissional antes do deploy real.

Este documento não tem como objetivo transformar o RockerPilates em uma plataforma enterprise complexa. O objetivo é garantir um nível de segurança adequado ao porte real do sistema, evitando exposição de dados, perda de histórico financeiro, acesso indevido e configuração insegura em produção.

---

## 2. Estado atual do projeto

O projeto está em fase final de preparação para produção.

Atualmente, o RockerPilates possui:

* frontend em Next.js;
* BFF em Spring Boot;
* `usuarios-service` em Spring Boot;
* `gerenciador-service` em Spring Boot;
* PostgreSQL em Docker;
* autenticação com JWT;
* cookies separados para admin e aluno;
* painel administrativo;
* portal do aluno;
* cadastro e listagem de alunos;
* assinatura/plano do aluno;
* controle financeiro manual;
* histórico financeiro do aluno;
* CMS básico;
* upload local de mídia;
* variáveis de ambiente parametrizadas;
* documentação inicial de backup;
* init script para criação do banco `gerenciador_db`;
* separação de rotas admin/aluno no frontend.

O projeto está adequado para desenvolvimento local e homologação interna, mas ainda não deve ser liberado para produção real antes da conclusão dos bloqueadores descritos neste documento.

---

## 3. Controles de segurança já implementados

### 3.1 Separação entre admin e aluno

O projeto possui fluxos separados para administrador e aluno.

Cookies usados:

```text
admin_token
aluno_token
```

Rotas protegidas:

```text
/admin/**
/aluno/**
```

Comportamento validado:

* usuário não autenticado acessando `/admin` é redirecionado para `/admin/login`;
* usuário não autenticado acessando `/aluno/perfil` é redirecionado para `/login`;
* admin autenticado acessando `/admin/login` é redirecionado para `/admin`;
* aluno autenticado acessando `/login` é redirecionado para `/aluno/perfil`.

O arquivo antigo duplicado de middleware foi removido. O projeto mantém o middleware correto em:

```text
frontend/rockepilates-web/src/middleware.ts
```

---

### 3.2 Cookies HttpOnly

Os cookies de autenticação são configurados com:

```text
HttpOnly
SameSite=Lax
path=/
expiração definida
Secure parametrizado por ambiente
```

A configuração `Secure` é controlada pela variável:

```env
APP_COOKIE_SECURE
```

Para desenvolvimento local:

```env
APP_COOKIE_SECURE=false
```

Para produção:

```env
APP_COOKIE_SECURE=true
```

Essa configuração já está preparada no BFF por meio do `CookieSecurityUtil`.

---

### 3.3 CORS parametrizado

O BFF não usa mais CORS fixo apenas para `localhost`.

A origem permitida é configurada por:

```env
APP_CORS_ALLOWED_ORIGINS
```

No ambiente local, o valor usado é:

```env
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Em desenvolvimento local no Windows, o frontend pode precisar usar:

```env
NEXT_PUBLIC_BFF_URL=http://127.0.0.1:8080
```

Em produção, o valor deve apontar somente para o domínio real do frontend.

Exemplo:

```env
APP_CORS_ALLOWED_ORIGINS=https://www.dominio-da-cliente.com.br
```

Não é permitido usar `*` em produção.

---

### 3.4 Variáveis de ambiente parametrizadas

O `docker-compose.yml` foi ajustado para ler variáveis de ambiente com fallback local.

Foram parametrizados itens como:

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
USUARIOS_DB_URL
GERENCIADOR_DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION
JWT_ALUNO_SECRET
JWT_ALUNO_EXPIRATION
SPRING_PROFILES_ACTIVE
USUARIOS_URL
GERENCIADOR_URL
APP_COOKIE_SECURE
APP_CORS_ALLOWED_ORIGINS
NEXT_PUBLIC_BFF_URL
BFF_INTERNAL_URL
```

Também existe um `.env.example` documentando as principais variáveis.

Os fallbacks locais são aceitáveis apenas para desenvolvimento. Produção deve usar um arquivo `.env` real, externo ao repositório, com senhas e secrets fortes.

Separação de Compose por ambiente:

* `docker-compose.yml` é o arquivo base para desenvolvimento local e pode publicar portas úteis para debug;
* `docker-compose.prod.yml` é o override mínimo para produção;
* em produção, `postgres`, `usuarios-service`, `gerenciador-service` e `bff-pilates` não devem publicar portas diretamente no host;
* o frontend e o BFF devem ser acessados por domínio real e reverse proxy;
* a exposição pública em produção deve ficar restrita a `80` e `443`.

No `docker-compose.prod.yml` atual, o `frontend` ainda pode aparecer publicado em `3000` como etapa intermediária. Isso é temporário até configurar Nginx/reverse proxy. No deploy final, o frontend também deve ficar atrás do reverse proxy, e publicamente devem responder apenas `80` e `443`.

Além da restrição de portas, o `gerenciador-service` deve aceitar chamadas internas somente quando a requisição trouxer o header `X-Internal-Service-Token` com o valor configurado por `INTERNAL_SERVICE_TOKEN`. O valor local é apenas exemplo; em produção, deve ser forte, ficar fora do Git e ser compartilhado somente entre BFF e `gerenciador-service`.

---

### 3.5 Banco de dados

O projeto usa PostgreSQL em Docker.

Existe init script para criação do banco `gerenciador_db`:

```text
docker/postgres/init/01-create-databases.sql
```

O `docker-compose.yml` monta:

```text
./docker/postgres/init:/docker-entrypoint-initdb.d
```

Essa configuração permite inicializar corretamente os bancos quando o volume do PostgreSQL é criado do zero.

---

### 3.6 Backup documentado

Existe documentação inicial de backup em:

```text
docs/backup.md
```

O documento cobre:

* backup de `usuarios_db`;
* backup de `gerenciador_db`;
* backup da pasta `uploads/`;
* restauração em PowerShell;
* restauração em Bash/Linux.

O `.gitignore` foi atualizado para evitar commit acidental de arquivos de backup:

```text
backup-*.sql
backup-*.zip
backup-*.tar.gz
*.dump
*.backup
```

Ainda falta executar e validar um teste real de restauração antes da produção.

---

### 3.7 Upload de mídia

O projeto possui upload de mídia para uso no CMS/site/depoimentos.

Os arquivos são armazenados localmente na pasta:

```text
uploads/
```

No Docker, há volume compartilhado para persistência das mídias.

Para produção inicial em VPS, o storage local pode ser mantido temporariamente, desde que:

* a pasta `uploads/` tenha volume persistente;
* a pasta `uploads/` entre na rotina de backup;
* os arquivos enviados sejam validados;
* o servidor não execute arquivos enviados como código.

Como evolução futura, o projeto pode migrar para S3, CloudFront ou solução equivalente.

---

### 3.8 Logout após troca de senha do aluno

O fluxo de troca de senha do aluno já encerra a sessão atual.

Após a troca de senha:

* os campos do formulário são limpos;
* a sessão do aluno é encerrada;
* o cookie `aluno_token` é removido;
* o aluno é redirecionado para `/login`;
* o aluno precisa entrar novamente usando a nova senha.

Arquivos envolvidos:

```text
frontend/rockepilates-web/src/app/api/aluno/logout/route.ts
frontend/rockepilates-web/src/lib/api/aluno-perfil-client.ts
frontend/rockepilates-web/src/components/aluno/AlterarSenhaForm.tsx
```

---

### 3.9 Controle financeiro manual

A regra de negócio atual do RockerPilates é:

* a professora/cliente controla o financeiro manualmente;
* o sistema registra, calcula e auxilia;
* o sistema não toma decisões automáticas sozinho;
* o sistema não cancela assinatura automaticamente;
* o sistema não gera cobrança bancária real;
* o primeiro pagamento é obrigatório ao cadastrar um novo aluno;
* o primeiro ciclo é criado como `PAGO`;
* o próximo ciclo é criado automaticamente como `PENDENTE`;
* pagamentos futuros podem ser marcados como pagos antecipadamente;
* o histórico financeiro mantém o botão “Marcar pago” quando fizer sentido para o negócio.

Essa regra é importante para evitar automações perigosas ou decisões financeiras indevidas.

---

## 4. Estado atual de liberação

Classificação atual do projeto:

| Ambiente                           | Estado               |
| ---------------------------------- | -------------------- |
| Desenvolvimento local              | Liberado             |
| Homologação interna                | Liberado com atenção |
| Produção real com dados da cliente | Ainda não liberado   |
| Produção após bloqueadores mínimos | Liberável            |
| Evoluções avançadas de segurança   | Fase futura          |

Conclusão atual:

```text
O RockerPilates ainda não está liberado para produção real.
```

Motivo:

Ainda faltam controles mínimos de segurança de produção relacionados a HTTPS, firewall, banco de dados, rate limit, headers HTTP, validação de upload, logs de segurança, backup testado e revisão de fluxos financeiros críticos.

---

## 5. Bloqueadores obrigatórios antes da produção

Os itens abaixo precisam estar concluídos antes de hospedar o sistema para uso real da cliente.

---

### 5.1 Configurar HTTPS

Produção deve obrigatoriamente usar HTTPS.

Se o deploy for feito em VPS, a configuração recomendada é:

* Nginx como reverse proxy;
* Certbot/Let’s Encrypt para certificado SSL;
* redirecionamento automático de HTTP para HTTPS;
* renovação automática do certificado.

Critérios de aceite:

* o domínio público abre com `https://`;
* requisições HTTP redirecionam para HTTPS;
* login admin funciona em HTTPS;
* login aluno funciona em HTTPS;
* cookies são enviados corretamente com `Secure=true`.

---

### 5.2 Ativar cookies seguros em produção

A variável abaixo deve ser obrigatoriamente configurada em produção:

```env
APP_COOKIE_SECURE=true
```

Critérios de aceite:

* cookie `admin_token` aparece com atributo `Secure`;
* cookie `aluno_token` aparece com atributo `Secure`;
* login admin continua funcionando;
* login aluno continua funcionando;
* ambiente local continua usando `APP_COOKIE_SECURE=false`.

---

### 5.3 Restringir CORS ao domínio real

Em produção, a variável abaixo deve apontar somente para o domínio real do frontend:

```env
APP_CORS_ALLOWED_ORIGINS=https://www.dominio-da-cliente.com.br
```

Critérios de aceite:

* frontend real consegue chamar o BFF;
* origem desconhecida não é liberada;
* `localhost` não fica liberado no ambiente de produção;
* não existe configuração com `*`.

---

### 5.4 Impedir exposição pública do PostgreSQL

O PostgreSQL não pode ficar acessível pela internet.

Em produção:

* porta `5432` não deve estar pública;
* acesso ao banco deve ocorrer apenas pela rede interna do servidor/container;
* firewall deve bloquear conexões externas;
* backups devem ser executados de forma controlada.

Critérios de aceite:

* aplicação conecta normalmente ao banco;
* acesso externo à porta `5432` é bloqueado;
* banco não aparece como serviço aberto publicamente;
* credenciais reais de produção não ficam no repositório.

Ao usar Docker Compose em produção, subir com:

```powershell
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

O override de produção remove a publicação direta da porta `5432`.

---

### 5.5 Configurar firewall da VPS

A VPS deve ter firewall ativo antes da produção.

Portas públicas esperadas:

```text
80
443
22
```

A porta `22` deve ser protegida, preferencialmente com acesso por chave SSH.

Com `docker-compose.prod.yml`, as portas abaixo não devem responder publicamente:

```text
5432
8080
8081
8082
```

O BFF deve ficar acessível apenas pela rede interna/reverse proxy. O frontend também deve ser servido pelo domínio real por meio do reverse proxy.

Portas que não devem ficar abertas publicamente:

```text
5432
8080
8081
8082
```

Critérios de aceite:

* site acessível por HTTPS;
* serviços internos inacessíveis externamente;
* banco inacessível externamente;
* SSH protegido;
* aplicação continua funcionando internamente.

---

### 5.6 Confirmar BCrypt nas senhas

Antes da produção, é obrigatório confirmar que as senhas são salvas com hash seguro.

Verificar no `usuarios-service` se existe configuração com `BCryptPasswordEncoder` ou equivalente.

Critérios de aceite:

* senha nunca é salva em texto puro;
* hash no banco segue padrão BCrypt;
* login continua funcionando;
* cadastro/troca/redefinição de senha usam o mesmo mecanismo seguro.

Se for identificado que senha está sendo salva em texto puro, produção fica bloqueada.

---

### 5.7 Validar política mínima de senha no backend

A validação de senha não pode depender só do frontend.

O backend deve rejeitar senhas fracas em:

* cadastro de aluno;
* troca de senha do aluno;
* redefinição de senha pelo admin;
* qualquer criação futura de admin.

Regra mínima recomendada:

```text
mínimo de 8 caracteres
não permitir senha vazia
não permitir senha só com espaços
```

Regra recomendada para evolução:

```text
mínimo de 8 caracteres
pelo menos uma letra
pelo menos um número
```

Critérios de aceite:

* backend rejeita senha inválida;
* frontend exibe mensagem amigável;
* mensagens de erro não expõem detalhe interno.

---

### 5.8 Implementar rate limit no login

O login precisa ter proteção contra muitas tentativas em sequência.

Rotas sensíveis:

```text
login admin
login aluno
troca de senha
redefinição de senha
```

A primeira implementação pode ser feita no Nginx com `limit_req`.

Critérios de aceite:

* múltiplas tentativas rápidas são limitadas;
* login legítimo continua funcionando;
* excesso de tentativas não derruba o sistema;
* logs registram tentativas suspeitas.

---

### 5.9 Configurar headers de segurança

Produção deve retornar headers HTTP mínimos.

Headers recomendados:

```text
Strict-Transport-Security
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Content-Security-Policy
Permissions-Policy
```

CSP inicial sugerida:

```text
default-src 'self';
img-src 'self' data: https:;
script-src 'self';
style-src 'self' 'unsafe-inline';
connect-src 'self';
frame-ancestors 'none';
```

A CSP pode precisar de ajustes caso o projeto use imagens externas, fontes externas ou integrações futuras.

Critérios de aceite:

* site continua funcionando;
* headers aparecem nas respostas públicas;
* não há quebra visual relevante;
* console do navegador não mostra bloqueios críticos inesperados.

---

### 5.10 Revisar segurança do upload de mídia

O upload de mídia precisa validar os arquivos enviados.

Regras mínimas:

* permitir apenas imagens;
* limitar tamanho;
* validar extensão;
* validar tipo MIME;
* gerar nome seguro para o arquivo;
* impedir path traversal;
* não executar arquivo enviado;
* não aceitar arquivos `.html`, `.js`, `.php`, `.sh`, `.bat`, `.cmd`, `.jar`, `.exe`.

Extensões permitidas inicialmente:

```text
.jpg
.jpeg
.png
.webp
```

Tamanho recomendado inicialmente:

```text
5MB por arquivo
```

Critérios de aceite:

* imagem válida faz upload normalmente;
* arquivo inválido é recusado;
* nome malicioso não afeta o servidor;
* arquivo salvo recebe nome seguro;
* imagens continuam aparecendo no site.

---

### 5.11 Ocultar stack trace em produção

Erros em produção não podem expor detalhes internos.

O ambiente de produção deve usar:

```env
SPRING_PROFILES_ACTIVE=prod
```

E configurar:

```properties
server.error.include-stacktrace=never
server.error.include-message=never
server.error.include-binding-errors=never
```

Critérios de aceite:

* erro 500 retorna mensagem genérica;
* detalhes técnicos aparecem apenas nos logs internos;
* frontend mostra mensagem segura;
* usuário não vê stack trace, SQL, classe Java ou caminho interno.

---

### 5.12 Criar logs mínimos de segurança

O projeto precisa registrar ações sensíveis.

Eventos mínimos:

* login admin bem-sucedido;
* login admin falho;
* login aluno bem-sucedido;
* login aluno falho;
* acesso negado;
* troca de senha do aluno;
* redefinição de senha do aluno pelo admin;
* marcação de pagamento como pago;
* cancelamento de assinatura, se existir;
* erro inesperado no BFF;
* erro inesperado nos serviços internos.

Os logs não devem registrar:

```text
senha
token JWT
cookie
secret
dados sensíveis completos sem necessidade
```

Critérios de aceite:

* ação sensível gera log;
* log ajuda a investigar problema;
* log não vaza senha/token;
* log identifica data/hora, ação e origem suficiente.

---

### 5.13 Testar backup e restauração

A documentação de backup já existe, mas ainda precisa ser validada.

Antes da produção, executar teste de restauração.

Fluxo mínimo:

1. gerar backup do `usuarios_db`;
2. gerar backup do `gerenciador_db`;
3. gerar backup da pasta `uploads/`;
4. subir ambiente limpo;
5. restaurar os bancos;
6. restaurar os uploads;
7. validar login;
8. validar alunos;
9. validar financeiro;
10. validar imagens do CMS/site.

Critérios de aceite:

* backup é gerado;
* backup é restaurado;
* sistema sobe com os dados restaurados;
* imagens continuam disponíveis;
* documentação fica confirmada na prática.

---

### 5.14 Revisar acesso por ID

Antes da produção, revisar endpoints que recebem ID na URL ou no payload.

Objetivo:

* aluno não pode acessar dados de outro aluno;
* admin só acessa dados administrativos autenticado como admin;
* serviços internos não aceitam chamadas críticas sem validação adequada;
* alteração manual de ID não vaza dados.

Como reforço mínimo contra chamadas diretas indevidas ao `gerenciador-service`, o serviço deve validar o header `X-Internal-Service-Token`. Chamadas sem esse header, ou com token incorreto, devem ser negadas antes de chegar aos controllers internos. Esse controle não substitui firewall, reverse proxy e portas fechadas, mas reduz o risco caso o serviço interno seja exposto por erro de infraestrutura.

Pontos a revisar:

```text
perfil do aluno
financeiro do aluno
histórico financeiro
pagamento por ID
aluno por ID
assinatura por ID
redefinição de senha
rotas administrativas
rotas do portal do aluno
```

Critérios de aceite:

* aluno autenticado acessa apenas seus próprios dados;
* admin autenticado acessa dados administrativos;
* usuário sem token é bloqueado;
* token de aluno não acessa rota de admin;
* token de admin não é tratado como aluno.

---

### 5.15 Revisar duplicidade na marcação de pagamento

O fluxo financeiro precisa impedir inconsistência por clique duplo ou requisição repetida.

O sistema deve garantir que:

* pagamento já `PAGO` não seja processado novamente;
* próximo ciclo não seja gerado duas vezes;
* assinatura não fique com vencimento inconsistente;
* histórico financeiro não duplique registros indevidos.

Solução mínima recomendada:

* operação transacional;
* validação de status antes de processar;
* se pagamento já estiver `PAGO`, não gerar novo ciclo;
* garantir que só exista um próximo ciclo válido para aquele contexto.

Solução futura recomendada:

* usar `@Version` em entidades financeiras críticas;
* reforçar idempotência se o sistema crescer.

Critérios de aceite:

* clique duplo em “Marcar pago” não duplica cobrança;
* repetir a mesma requisição não cria ciclo extra;
* histórico continua consistente;
* assinatura aponta para o vencimento correto.

---

### 5.16 Criar política mínima de privacidade

Antes da produção, o projeto precisa ter uma orientação mínima de privacidade para a cliente.

O documento deve deixar claro:

* quais dados dos alunos são cadastrados;
* por que os dados são usados;
* quem tem acesso administrativo;
* como solicitar correção de dados;
* como solicitar remoção de dados;
* como os backups são tratados;
* que o sistema é usado para gestão interna da professora/empresa.

Essa política pode ser simples inicialmente, mas precisa existir antes do uso real com alunos.

Critérios de aceite:

* cliente entende quais dados está armazenando;
* existe orientação para correção/remoção de dados;
* sistema evita coleta desnecessária;
* documentação fica salva no projeto.

---

## 6. Melhorias importantes após a primeira produção

Os itens abaixo são importantes, mas não bloqueiam o primeiro deploy se os bloqueadores mínimos estiverem concluídos.

---

### 6.1 Endpoint dedicado para validação de admin

Melhoria futura já registrada:

```text
/auth/validate-admin
```

Objetivo:

* evitar validação indireta;
* deixar a autorização admin mais clara;
* reduzir acoplamento entre BFF e listagem de usuários;
* melhorar legibilidade da arquitetura.

---

### 6.2 Invalidar tokens antigos após troca ou redefinição de senha

Como o JWT é stateless, um token já emitido pode continuar válido até expirar.

Melhoria futura:

* adicionar `tokenVersion`;
* adicionar `sessionVersion`;
* ou criar tabela de sessões;
* incrementar versão após troca/redefinição de senha;
* rejeitar tokens antigos.

Essa melhoria é importante principalmente para:

* redefinição de senha feita pelo admin;
* troca de senha feita pelo aluno;
* suspeita de conta comprometida.

---

### 6.3 Logs estruturados com correlationId

Melhoria futura:

* gerar `correlationId` por requisição;
* propagar entre frontend, BFF e serviços;
* facilitar rastreio de erros;
* melhorar diagnóstico em produção.

---

### 6.4 Health check detalhado

Melhoria futura:

* BFF indicar status do `usuarios-service`;
* BFF indicar status do `gerenciador-service`;
* medir latência dos serviços;
* retornar status consolidado.

---

### 6.5 Testes automatizados

Ainda não afirmar que o projeto tem cobertura completa de testes automatizados.

Testes importantes para implementar:

* login admin;
* login aluno;
* proteção de rotas;
* cadastro de aluno;
* primeiro pagamento obrigatório;
* troca de senha;
* redefinição de senha;
* financeiro do aluno;
* histórico financeiro;
* marcação de pagamento como pago;
* geração de próximo ciclo;
* cancelamento de assinatura;
* filtros/paginação admin;
* permissões admin/aluno.

---

### 6.6 Ferramentas de análise

Rodar ferramentas de análise como melhoria de qualidade:

```text
npm audit
auditoria de dependências Java
GitLeaks
Trivy
OWASP ZAP
```

Essas ferramentas podem ser executadas manualmente no início e depois integradas em pipeline.

---

### 6.7 Exportação de dados

Melhoria futura:

* permitir exportar dados do aluno;
* permitir exportar histórico financeiro;
* facilitar atendimento a solicitações da cliente ou dos alunos.

Essa funcionalidade não é obrigatória para o primeiro deploy, mas melhora maturidade do sistema.

---

### 6.8 Reautenticação em ações críticas

Melhoria futura:

* pedir senha novamente em ações sensíveis.

Exemplos:

```text
redefinir senha de aluno
cancelar assinatura
excluir aluno
alterar dados financeiros críticos
```

---

### 6.9 Storage externo para mídia

Hoje o projeto usa storage local em `uploads/`.

Melhoria futura:

```text
S3
CloudFront
CDN equivalente
compressão de imagem
cache global
```

Para primeira produção em VPS, storage local com volume persistente e backup pode ser aceito temporariamente.

---

## 7. Itens que não serão prioridade neste momento

Os itens abaixo não serão tratados como prioridade agora porque não são necessários para o porte atual do RockerPilates.

Eles podem ser reavaliados futuramente se o sistema crescer.

---

### 7.1 Refresh token com rotação

Não será prioridade inicial.

O projeto pode iniciar com:

* JWT com expiração definida;
* cookie `HttpOnly`;
* HTTPS;
* `Secure=true`;
* rate limit;
* senha forte.

Refresh token com rotação fica para fase futura.

---

### 7.2 Migração de HS256 para RS256

Não será prioridade inicial.

Para o porte atual do projeto, JWT com secret forte e bem protegido é suficiente.

Migração para RS256 pode ser considerada se o projeto crescer, ganhar mais serviços independentes ou exigir rotação formal de chaves.

---

### 7.3 Autenticação em dois fatores

Não será prioridade inicial.

É uma melhoria boa para admin, mas antes disso o projeto precisa concluir:

* HTTPS;
* rate limit;
* senha forte;
* cookie seguro;
* firewall;
* logs de segurança.

---

### 7.4 Criptografia campo a campo de dados pessoais

Não será prioridade inicial.

Para o momento atual, a proteção principal será:

* banco não exposto;
* acesso restrito;
* backup controlado;
* logs sem vazamento;
* uso mínimo de dados;
* credenciais fortes;
* servidor protegido.

Criptografia campo a campo pode dificultar busca e operação administrativa. Deve ser reavaliada se o volume de alunos, a criticidade ou as exigências aumentarem.

---

### 7.5 Observabilidade completa com Grafana/Loki/ELK

Não será prioridade inicial.

No começo, logs do servidor e Docker podem ser suficientes, desde que os eventos de segurança mínimos sejam registrados.

Centralização de logs fica como evolução futura.

---

### 7.6 Pentest externo

Não será prioridade inicial se não estiver contratado pela cliente.

Antes disso, o projeto deve passar por:

* revisão manual;
* testes funcionais de segurança;
* análise de dependências;
* verificação de upload;
* teste de backup;
* teste de autorização;
* revisão de configuração de produção.

---

## 8. Ordem prática de execução

A ordem recomendada a partir deste documento é:

```text
1. Criar ou atualizar docs/seguranca-producao.md
2. Commitar a documentação
3. Verificar BCrypt no usuarios-service
4. Validar política mínima de senha no backend
5. Implementar rate limit no login
6. Configurar headers de segurança
7. Revisar upload de mídia
8. Planejar firewall e exposição do banco para produção
9. Testar backup e restauração
10. Revisar duplicidade na marcação de pagamento
11. Criar política mínima de privacidade
12. Preparar deploy real
```

---

## 9. Critério final para liberar produção

O RockerPilates só deve ser liberado para produção real quando os itens abaixo estiverem concluídos:

```text
HTTPS configurado
APP_COOKIE_SECURE=true em produção
CORS restrito ao domínio real
PostgreSQL não exposto publicamente
Firewall configurado
BCrypt confirmado
Validação mínima de senha no backend
Rate limit no login
Headers de segurança configurados
Upload de mídia validado
Stack trace oculto em produção
Logs mínimos de segurança
Backup e restauração testados
Revisão de acesso por ID concluída
Revisão de duplicidade financeira concluída
Política mínima de privacidade criada
```

Quando esses itens forem concluídos, o projeto pode ser classificado como:

```text
GO controlado para produção.
```

Isso significa que o sistema estará adequado para o porte atual da cliente, com segurança suficiente para operar de forma responsável.

---

## 10. Observação final

O RockerPilates já possui uma base importante de segurança, principalmente em autenticação, cookies, separação de rotas, CORS e parametrização de ambiente.

O trabalho atual não é recomeçar a segurança do zero.

O trabalho atual é fechar a camada final necessária para produção:

```text
HTTPS
firewall
banco protegido
rate limit
headers
upload seguro
logs mínimos
backup testado
revisão financeira
privacidade mínima
```

Após isso, o projeto pode seguir para deploy com muito mais segurança e profissionalismo.
