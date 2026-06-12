# AGENTS.md

# RockerPilates — Regras para Agentes de IA

Este é um projeto real para uma cliente real.

As regras abaixo são obrigatórias para qualquer agente de IA que trabalhe neste repositório.

---

# Arquitetura Obrigatória

O sistema segue a arquitetura:

Frontend Next.js
↓
BFF Spring Boot
↓
Microserviços Spring Boot
↓
PostgreSQL

Regras:

* O frontend não deve chamar microserviços diretamente.
* Todo acesso externo deve passar pelo BFF.
* Não criar atalhos que contornem o BFF.
* Respeitar a separação entre:

  * frontend
  * bff-pilates
  * usuarios-service
  * gerenciador-service
* Não mover responsabilidades entre serviços sem justificativa explícita.

---

# Regras Gerais

Antes de alterar qualquer arquivo:

1. Rode:

```bash
git status
```

2. Informe:

* branch atual;
* se o working tree está limpo;
* quais arquivos possuem alterações pendentes.

Regras obrigatórias:

* Não inventar funcionalidades.
* Não assumir que algo existe sem verificar o código.
* Não afirmar que algo está implementado sem evidência real.
* Não fazer alterações fora do escopo solicitado.
* Não misturar refatorações grandes com features pequenas.
* Não modificar arquivos sem necessidade.
* Preservar padrões existentes do projeto.
* Preferir alterações pequenas, objetivas e fáceis de revisar.

---

# Proteção de Alterações Existentes

Considere qualquer alteração já presente no working tree como trabalho do usuário.

Regras:

* Leia o diff antes de alterar arquivos já modificados.
* Explique riscos de conflito quando houver alterações pendentes.
* Nunca sobrescreva alterações existentes sem autorização explícita.
* Nunca descarte trabalho do usuário.

Comandos proibidos sem autorização explícita:

```bash
git reset --hard
git clean -fd
git checkout -- .
git checkout -- <arquivo>
```

ou qualquer equivalente destrutivo.

---

# Git e Versionamento

Não executar sem autorização explícita:

```bash
git commit
git push
git merge
git rebase
git cherry-pick
git reset
git revert
```

Não criar branches automaticamente.

Fluxo padrão do projeto:

```txt
develop
├── feature/*
├── hotfix/*
```

Sempre informar:

* arquivos alterados;
* motivo da alteração;
* impacto esperado.

---

# Segurança

Nunca:

* expor tokens;
* expor secrets;
* expor senhas;
* expor chaves privadas;
* adicionar credenciais reais em arquivos versionados.

Utilizar:

* variáveis de ambiente;
* arquivos de exemplo;
* documentação de configuração.

Não remover:

* autenticação;
* autorização;
* validações;
* rate limit;
* headers de segurança;
* proteções de sessão.

Ao alterar:

* JWT;
* Cookies;
* CORS;
* Headers HTTP;
* Feign;
* Resilience4j;
* autenticação;

explicar o impacto antes da alteração.

Nunca reduzir requisitos de segurança apenas para "fazer funcionar".

---

# Regras de Negócio RockerPilates

A cliente controla manualmente o financeiro.

O sistema:

* registra;
* calcula;
* organiza;
* auxilia;
* alerta.

O sistema NÃO deve:

* cobrar automaticamente;
* cancelar automaticamente assinaturas;
* tomar decisões financeiras sozinho;
* executar ações financeiras externas automaticamente.

Regras confirmadas:

* Novo aluno só inicia após pagamento do primeiro ciclo.
* Primeiro pagamento é obrigatório.
* Pagamentos futuros podem ser pagos antecipadamente.
* O botão principal de ação financeira deve permanecer seguro.
* O histórico financeiro deve continuar permitindo registrar pagamentos futuros antecipados.
* Dados antigos inconsistentes são dados de teste e serão removidos antes da carga oficial.

---

# Execução de Comandos

Executar apenas comandos necessários para a tarefa.

Antes de executar:

* build;
* testes;
* docker compose;
* scripts demorados;

informar o comando.

Se um comando falhar:

* mostrar o erro relevante;
* não tentar correções automáticas quando o usuário pediu apenas diagnóstico.

Não:

* instalar dependências;
* atualizar versões;
* alterar lockfiles;
* alterar Dockerfiles;
* alterar imagens Docker;

sem solicitação explícita.

---

# Alterações de Código

Antes de editar:

* entender o módulo afetado;
* identificar impacto da alteração;
* localizar dependências relevantes.

Regras:

* alterar o menor número possível de arquivos;
* não fazer refatorações oportunistas;
* não alterar contratos públicos sem necessidade;
* não alterar APIs sem justificativa;
* não alterar comportamento externo sem aprovação.

Ao adicionar configurações:

* validar nomes das propriedades;
* validar compatibilidade com framework;
* validar compatibilidade com a versão utilizada.

Ao alterar:

* Feign Clients;
* Circuit Breakers;
* Retry;
* Timeouts;
* JWT;
* Cookies;

avaliar impacto em produção.

---

# Testes e Build

Após alterações de código:

Executar o menor teste ou build relevante.

Para o BFF:

```powershell
.\gradlew.bat :backend:bff-pilates:bootJar --no-daemon
```

Para usuarios-service:

```powershell
.\gradlew.bat :backend:usuarios-service:bootJar --no-daemon
```

Para gerenciador-service:

```powershell
.\gradlew.bat :backend:gerenciador-service:bootJar --no-daemon
```

Se não for possível executar:

* informar claramente o motivo.

Nunca afirmar:

* "funciona";
* "corrigido";
* "resolvido";

sem evidência de build ou teste.

---

# Docker

Não alterar:

* docker-compose.yml
* Dockerfiles
* volumes
* variáveis de ambiente

sem necessidade clara.

Ao alterar Docker:

* explicar impacto;
* informar containers afetados;
* informar necessidade de rebuild.

---

# Documentação Obrigatória

Antes de iniciar qualquer implementação, correção, refatoração ou análise arquitetural:

1. Ler obrigatoriamente:

```txt
docs/ia/rockerpilates-script-mestre.md
```

2. Ler:

```txt
docs/seguranca-producao.md
```

3. Ler:

```txt
docs/backup.md
```

4. Verificar git status.

5. Confirmar estado atual do projeto.

6. Verificar se a funcionalidade já existe.

7. Confirmar que a alteração não conflita com regras de negócio documentadas.

---

# Produção

Nunca afirmar que o projeto está pronto para produção sem confirmação explícita dos seguintes itens:

* HTTPS configurado;
* domínio configurado;
* backup testado;
* restauração testada;
* APP_COOKIE_SECURE validado;
* CORS restrito;
* banco protegido;
* firewall configurado;
* validações de segurança revisadas;
* testes finais realizados.

---

# Comunicação

Responder de forma objetiva.

Quando o usuário pedir apenas:

* análise;
* diagnóstico;
* diff;
* status;
* revisão;

não alterar arquivos.

Quando mostrar diffs:

* mostrar apenas alterações relevantes.

Quando houver dúvida:

* perguntar antes de alterar.

---

# Formato de Entrega

Ao finalizar uma tarefa com alterações, informar:

## Arquivos alterados

* caminho completo dos arquivos

## Alterações realizadas

* resumo objetivo

## Comandos executados

* listar comandos

## Resultado

* build/testes executados
* sucesso ou falha

## Riscos conhecidos

* impactos
* limitações
* pendências

## Próximos passos sugeridos

* próximos itens recomendados
