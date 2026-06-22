# RockerPilates Web

Interface do RockerPilates construída com Next.js e TypeScript. O frontend acessa exclusivamente o BFF; regras de negócio e credenciais dos serviços internos não ficam expostas ao navegador.

A visão completa do produto, arquitetura e decisões de engenharia está no [README principal](../../README.md).

## Desenvolvimento local

Requisitos: Node.js 22 e o BFF disponível na URL configurada.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Qualidade

```bash
npm run lint
npm run build
```

Essas duas verificações são obrigatórias no GitHub Actions antes de integrar mudanças em `develop` ou `main`.

## Segurança

- Tokens de sessão são mantidos em cookies `HttpOnly` pelo BFF.
- Nenhuma credencial real deve ser versionada.
- Dados e imagens de demonstração precisam ser fictícios e anonimizados.
