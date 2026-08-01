# Deploy v1 - Preparacao RockerPilates

Estado: preparado para executar quando `rockerpilates.com` puder ser apontado no Wix/registrador. A conta `rockerpilates@gmail.com` deve ser tratada como e-mail/login administrativo, nao como alvo de deploy.

## Arquitetura de producao v1

- Publico: landing page em `https://rockerpilates.com`.
- Admin privado: `https://rockerpilates.com/admin/login`.
- CMS: `https://rockerpilates.com/admin/site`.
- Depoimentos: `https://rockerpilates.com/admin/depoimentos`.
- BFF: acessivel publicamente apenas pelo path `https://rockerpilates.com/bff/...`.
- PostgreSQL, `usuarios-service` e `gerenciador-service`: sem porta publica.
- Frontend e BFF: publicados somente em `127.0.0.1` para o Nginx local.

## Enquanto o dominio esta fora do ar

Deixe pronto:

1. VPS criada e atualizada.
2. Docker e Docker Compose instalados.
3. Nginx instalado.
4. Certbot instalado.
5. Repositorio clonado na branch `main`.
6. `.env` de producao criado a partir de `deploy/env.production.example`.
7. Secrets reais gerados fora do Git.
8. Firewall liberando somente `22`, `80` e `443`.
9. Backup/restauracao testados em ambiente separado.

## Wix: remover redirecionamento atual

Contexto atual:

- O dominio `rockerpilates.com` esta sob gestao do Wix/conta da cliente.
- Hoje ele pode estar redirecionando para `https://www.rockeracademy.com/`, que e o negocio separado de formacao.
- Para a v1, `rockerpilates.com` deve abrir a landing nova do studio RockerPilates.
- `rockeracademy.com` deve continuar existindo separado, apenas linkado discretamente na landing.

Quando a hospedagem nova estiver pronta, no painel Wix/registrador:

1. Acessar dominios do site/conta que controla `rockerpilates.com`.
2. Remover regra de redirecionamento para `https://www.rockeracademy.com/`.
3. Remover qualquer encaminhamento/forwarding ativo do dominio raiz ou `www`.
4. Configurar DNS para apontar `rockerpilates.com` para a VPS/hospedagem nova.
5. Aguardar propagacao de DNS.
6. Emitir HTTPS com Certbot somente depois que o DNS apontar corretamente.

Cuidado: nao alterar `rockeracademy.com` nesta etapa. Ele continua sendo o site do segundo negocio da cliente.

## DNS quando o dominio voltar

Configurar no provedor do dominio:

```text
A     @      IP_DA_VPS
CNAME www    rockerpilates.com
```

Se o provedor nao aceitar CNAME no `www`, usar:

```text
A     www    IP_DA_VPS
```

## Subida da stack

No servidor:

```bash
git checkout main
git pull origin main
cp deploy/env.production.example .env
```

Edite `.env` com valores reais e fortes. As variaveis sensiveis obrigatorias nao aparecem no template para evitar falso positivo de secret scan; adicione no `.env` real do servidor `DB_PASSWORD`, `JWT_SECRET`, `JWT_ALUNO_SECRET` e `INTERNAL_SERVICE_TOKEN` com valores fortes.

Validar compose:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml config --quiet
```

Subir:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Checar containers:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

Checar localmente na VPS:

```bash
curl -I http://127.0.0.1:3000
curl -s http://127.0.0.1:8080/bff/health
```

## Nginx e HTTPS

Copiar o exemplo inicial, ainda sem certificado:

```bash
sudo cp deploy/nginx/rockerpilates.conf.example /etc/nginx/sites-available/rockerpilates
sudo ln -s /etc/nginx/sites-available/rockerpilates /etc/nginx/sites-enabled/rockerpilates
sudo nginx -t
sudo systemctl reload nginx
```

Gerar certificado e deixar o Certbot configurar HTTPS/redirecionamento:

```bash
sudo certbot --nginx -d rockerpilates.com -d www.rockerpilates.com
```

Depois de confirmar HTTPS funcionando pelo navegador, mudar no `.env`:

```env
APP_SECURITY_HSTS_ENABLED=true
```

E recriar os containers:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Checklist de aceite

- `https://rockerpilates.com` abre a landing.
- `http://rockerpilates.com` redireciona para HTTPS.
- `/admin/login` abre apenas a tela de login.
- `/admin/site` sem login redireciona para `/admin/login`.
- Login admin funciona em HTTPS.
- CMS salva texto, imagem, URL e video.
- Depoimento novo fica pendente.
- Admin aprova depoimento e ele aparece na landing.
- Admin desaprova depoimento e ele sai da landing.
- Botao "Agendar aula" abre agenda externa.
- Botao "Localizacao" abre Google Maps.
- Botao RockerAcademy abre `https://www.rockeracademy.com/`.
- Cookie `admin_token` aparece com `HttpOnly`, `SameSite=Lax` e `Secure`.
- `APP_CORS_ALLOWED_ORIGINS` nao contem `localhost` nem `*`.
- Portas `5432`, `8081` e `8082` nao respondem publicamente.
- Porta `8080` nao responde publicamente fora da VPS.
- Backup e restauracao foram testados.

## Rollback simples

Voltar para o commit anterior:

```bash
git log --oneline -5
git checkout COMMIT_ANTERIOR
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Para voltar para a `main` depois:

```bash
git checkout main
git pull origin main
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```
