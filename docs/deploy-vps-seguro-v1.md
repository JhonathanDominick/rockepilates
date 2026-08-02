# Deploy seguro em VPS - RockerPilates v1

Este runbook implementa a implantacao simples recomendada para a v1:

- Ubuntu 24.04 LTS.
- 2 vCPU.
- 4 GB RAM recomendado, 2 GB apenas com swap.
- 40 GB SSD.
- Docker Compose, Nginx, Certbot e PostgreSQL na mesma VPS.

O computador local continua sendo ambiente de desenvolvimento. A VPS e o servidor de producao.

## 1. Criar a VPS

No provedor escolhido, criar uma VPS com Ubuntu 24.04 LTS, IP publico fixo e snapshot/backup habilitado.

Antes de seguir, tenha uma chave SSH publica sua. No Windows, normalmente ela fica em:

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

Se nao existir, crie uma chave no computador local antes de endurecer o SSH da VPS.

## 2. Preparar a VPS

Conectar como root pelo console inicial do provedor ou SSH temporario e rodar:

```bash
export DEPLOY_USER=rocker
export AUTHORIZED_KEY='cole-a-chave-publica-ssh-aqui'
curl -fsSL https://raw.githubusercontent.com/JhonathanDominick/rockepilates/main/deploy/scripts/setup-vps-ubuntu.sh -o setup-vps-ubuntu.sh
sudo -E bash setup-vps-ubuntu.sh
```

Depois disso, abrir uma nova sessao:

```bash
ssh rocker@IP_DA_VPS
```

O script:

- cria usuario nao-root;
- exige chave SSH antes de bloquear senha;
- desabilita login root por SSH;
- instala Docker, Nginx, Certbot, UFW, fail2ban e atualizacoes automaticas;
- libera somente `22`, `80`, `443`;
- prepara swap e pasta segura de backup.

## 3. Clonar o projeto e gerar ambiente

Na VPS, como usuario `rocker`:

```bash
git clone https://github.com/JhonathanDominick/rockepilates.git
cd rockepilates
git checkout main
bash deploy/scripts/generate-production-env.sh
```

Revisar `.env`:

```bash
nano .env
```

Manter:

```text
NEXT_PUBLIC_BFF_URL=https://rockerpilates.com
APP_COOKIE_SECURE=true
APP_CORS_ALLOWED_ORIGINS=https://rockerpilates.com,https://www.rockerpilates.com
APP_SECURITY_HSTS_ENABLED=false
```

Nao copiar o `.env` real para Git, prints publicos ou mensagens.

## 4. Subir a stack localmente na VPS

```bash
bash deploy/scripts/deploy-prod.sh
bash deploy/scripts/validate-prod.sh
```

Neste ponto, frontend e BFF devem responder apenas localmente na VPS:

```text
127.0.0.1:3000
127.0.0.1:8080
```

PostgreSQL e servicos internos nao devem ter porta publica.

## 5. Configurar dominio no Wix

No Wix, remover o redirecionamento de `rockerpilates.com` para `rockeracademy.com`.

Configurar DNS:

```text
A      @      IP_DA_VPS
CNAME  www    rockerpilates.com
```

Se o Wix nao aceitar CNAME em `www`, usar:

```text
A      www    IP_DA_VPS
```

Nao alterar `rockeracademy.com`.

## 6. Ativar Nginx e HTTPS

Depois que o DNS apontar para a VPS:

```bash
export CERTBOT_EMAIL='email-da-cliente-ou-tecnico@dominio.com'
sudo -E bash deploy/scripts/install-nginx-certbot.sh
```

Validar no navegador:

```text
https://rockerpilates.com
https://www.rockerpilates.com
```

Depois de confirmar HTTPS funcionando:

```bash
bash deploy/scripts/enable-hsts.sh
bash deploy/scripts/validate-prod.sh
```

## 7. Backup e restauracao

Gerar backup manual:

```bash
bash deploy/scripts/backup-prod.sh
```

Testar restauracao em ambiente separado antes do go-live:

```bash
RESTORE_CONFIRM=YES bash deploy/scripts/restore-prod.sh /var/backups/rockerpilates/PASTA_DO_BACKUP
```

Para producao, agendar backup diario com cron do usuario `rocker`:

```bash
crontab -e
```

Adicionar:

```cron
15 3 * * * cd /home/rocker/rockepilates && bash deploy/scripts/backup-prod.sh >> /var/backups/rockerpilates/backup.log 2>&1
```

Copiar os backups periodicamente para um storage externo seguro.

## 8. Checklist final de seguranca

- GitHub com 2FA ativo.
- Wix com 2FA ativo.
- VPS acessivel por SSH com chave.
- Root login e senha SSH desativados.
- Firewall liberando somente `22`, `80`, `443`.
- Docker daemon nao exposto.
- PostgreSQL nao exposto.
- `APP_COOKIE_SECURE=true`.
- CORS sem `localhost`, `127.0.0.1` ou `*`.
- HTTPS funcionando.
- HSTS ativado somente depois do HTTPS validado.
- Backup gerado e restaurado em ambiente separado.
- Senha admin trocada antes de entregar para a cliente.
