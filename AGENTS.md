# Guia para agentes e contribuidores

## Arquitetura

Preserve o fluxo `Next.js -> BFF -> servicos Spring Boot -> PostgreSQL`.
O frontend nao deve acessar `usuarios-service` ou `gerenciador-service` diretamente.

## Direcao de produto da v1

A primeira versao publica do RockerPilates e uma landing page do studio para pessoas que querem praticar Pilates com a Evelyn.

A area privada da v1 nao e o sistema de gestao proprio completo. Ela contem apenas:

- `/admin/login` para acesso privado da cliente;
- `/admin` como entrada privada que redireciona para a area administrativa ativa da v1;
- `/admin/site` como CMS para editar a landing publica;
- `/admin/depoimentos` para aprovar e desaprovar depoimentos enviados pela landing.

Regras da v1:

- CTAs publicos devem levar aos canais que a cliente ja usa hoje, como agenda online, app de clientes, WhatsApp e Google Maps.
- A interface publica deve usar linguagem neutra da RockerPilates; nao destaque nomes de plataformas terceiras quando isso nao ajudar o visitante.
- RockerAcademy e o negocio de formacao de professores e deve aparecer apenas como link secundario externo.
- O sistema proprio de gestao ja construido deve ser preservado para migracao futura, mas nao deve ser promovido nem acessivel no modo v1.
- Depoimentos fazem parte da v1: o envio e publico, a moderacao e privada em `/admin/depoimentos`, e apenas aprovados aparecem na landing.
- O CMS/admin pode editar textos, imagens, videos configurados em campos existentes e links externos publicos da landing.
- Nao criar novas secoes publicas sem pedido explicito da cliente.

## Regras de trabalho

- leia o diff e preserve alteracoes existentes;
- faca mudancas pequenas, justificadas e faceis de revisar;
- nao altere contratos publicos ou regras financeiras fora do escopo;
- nao execute operacoes Git destrutivas;
- nao afirme sucesso sem build ou teste correspondente;
- mantenha rotas internas existentes, mesmo quando nao forem promovidas na v1 publica.

## Seguranca

- nunca versione tokens, senhas, cookies, chaves ou dados pessoais;
- nao reduza autenticacao, autorizacao, rate limit ou validacoes;
- mantenha secrets em variaveis de ambiente;
- trate uploads, logs e links externos como superficies de dados nao confiaveis;
- links configuraveis devem aceitar apenas URLs `http` ou `https` na renderizacao publica;
- em `APP_MODE=v1`, APIs e rotas fora de landing/admin/CMS devem ser bloqueadas.

## Regra financeira

O sistema auxilia a operacao; a responsavel pelo studio confirma pagamentos, cancelamentos e demais decisoes financeiras.
Nao introduza cobranca ou cancelamento automatico.

Na v1 publica, o financeiro proprio do RockerPilates nao entra no fluxo do visitante.
O agendamento e a gestao operacional continuam nos canais atuais da cliente ate ela decidir migrar.

## Validacao minima

```powershell
.\gradlew.bat clean test jacocoTestReport jacocoTestCoverageVerification --no-daemon
cd frontend\rockepilates-web
npm ci
npm run lint
npm run build
```

Validacao Docker local:

```powershell
docker compose config --quiet
docker compose up -d --build
docker compose ps
Invoke-WebRequest http://localhost:3000/ -UseBasicParsing
Invoke-WebRequest http://localhost:8080/bff/health -UseBasicParsing
```

Consulte `docs/script-mestre.md`, `docs/seguranca-producao.md` e `docs/backup.md` antes de alteracoes relacionadas a producao.
