# Guia para agentes e contribuidores

## Arquitetura

Preserve o fluxo `Next.js -> BFF -> serviços Spring Boot -> PostgreSQL`. O frontend não deve acessar `usuarios-service` ou `gerenciador-service` diretamente.

## Regras de trabalho

- leia o diff e preserve alterações existentes;
- faça mudanças pequenas, justificadas e fáceis de revisar;
- não altere contratos públicos ou regras financeiras fora do escopo;
- não execute operações Git destrutivas;
- não afirme sucesso sem build ou teste correspondente.

## Segurança

- nunca versione tokens, senhas, cookies, chaves ou dados pessoais;
- não reduza autenticação, autorização, rate limit ou validações;
- mantenha secrets em variáveis de ambiente;
- trate uploads e logs como superfícies de dados não confiáveis.

## Regra financeira

O sistema auxilia a operação; a responsável pelo estúdio confirma pagamentos, cancelamentos e demais decisões financeiras. Não introduza cobrança ou cancelamento automático.

## Validação mínima

```bash
./gradlew clean test
cd frontend/rockepilates-web
npm ci
npm run lint
npm run build
```

Consulte `docs/seguranca-producao.md` e `docs/backup.md` antes de alterações relacionadas a produção.

