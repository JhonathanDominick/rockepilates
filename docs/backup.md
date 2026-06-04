# Backup - RockerPilates

Este documento registra a estrategia inicial de backup para producao.

## Itens que precisam de backup

O projeto possui dois pontos principais de persistencia:

1. Banco PostgreSQL
2. Pasta `uploads/`

## Banco PostgreSQL

O banco roda no container:

```txt
postgres-rockepilates
```

O volume principal do banco e:

```txt
postgres_data
```

Atualmente o projeto utiliza dois bancos:

```txt
usuarios_db
gerenciador_db
```

O banco `usuarios_db` e criado automaticamente pelo `POSTGRES_DB`.

O banco `gerenciador_db` deve ser garantido pelo script de inicializacao:

```txt
docker/postgres/init/01-create-databases.sql
```

Esse script e executado automaticamente pelo Postgres apenas quando o volume do banco e criado pela primeira vez.

## Backup manual do banco

### Backup do usuarios_db

No PowerShell:

```powershell
docker exec postgres-rockepilates pg_dump -U rocker usuarios_db > backup-usuarios_db.sql
```

No Bash/Linux:

```bash
docker exec postgres-rockepilates pg_dump -U rocker usuarios_db > backup-usuarios_db.sql
```

### Backup do gerenciador_db

No PowerShell:

```powershell
docker exec postgres-rockepilates pg_dump -U rocker gerenciador_db > backup-gerenciador_db.sql
```

No Bash/Linux:

```bash
docker exec postgres-rockepilates pg_dump -U rocker gerenciador_db > backup-gerenciador_db.sql
```

## Restauracao do banco

A restauracao deve ser feita com cuidado. Em producao, antes de restaurar um backup, confirme se o banco atual pode ser sobrescrito.

### Restauracao no PowerShell

Para restaurar `usuarios_db`:

```powershell
Get-Content backup-usuarios_db.sql | docker exec -i postgres-rockepilates psql -U rocker usuarios_db
```

Para restaurar `gerenciador_db`:

```powershell
Get-Content backup-gerenciador_db.sql | docker exec -i postgres-rockepilates psql -U rocker gerenciador_db
```

### Restauracao no Bash/Linux

Para restaurar `usuarios_db`:

```bash
docker exec -i postgres-rockepilates psql -U rocker usuarios_db < backup-usuarios_db.sql
```

Para restaurar `gerenciador_db`:

```bash
docker exec -i postgres-rockepilates psql -U rocker gerenciador_db < backup-gerenciador_db.sql
```

## Uploads

A pasta de uploads fica montada no host em:

```txt
./uploads
```

Essa pasta precisa ser copiada junto com os backups do banco, porque ela armazena arquivos enviados pelo CMS, imagens e outras midias do sistema.

### Backup manual dos uploads

No PowerShell:

```powershell
Compress-Archive -Path uploads -DestinationPath backup-uploads.zip -Force
```

No Bash/Linux:

```bash
tar -czf backup-uploads.tar.gz uploads/
```

### Restauracao dos uploads

No PowerShell:

```powershell
Expand-Archive -Path backup-uploads.zip -DestinationPath . -Force
```

No Bash/Linux:

```bash
tar -xzf backup-uploads.tar.gz
```

## Arquivos de backup nao devem ir para o Git

Arquivos gerados por backup nao devem ser commitados.

Exemplos de arquivos que nao devem entrar no Git:

```txt
backup-usuarios_db.sql
backup-gerenciador_db.sql
backup-uploads.zip
backup-uploads.tar.gz
```

Esses arquivos podem conter dados reais de alunos, pagamentos, configuracoes e midias.

## Recomendacao para producao

Em producao, os backups devem ser automatizados.

Recomendacao inicial:

* backup diario do PostgreSQL
* backup diario da pasta `uploads/`
* manter pelo menos 7 copias diarias
* manter pelo menos 4 copias semanais
* armazenar pelo menos uma copia fora da VPS sempre que possivel

Exemplos de destino externo:

* outro servidor
* storage S3
* Google Drive
* Dropbox
* Backblaze B2
* outro servico de armazenamento seguro

## Observacoes importantes

Este documento e uma base inicial.

A automacao real dos backups deve ser configurada na etapa de deploy, junto com:

* VPS
* Docker Compose de producao
* Nginx
* HTTPS
* dominio real
* politica de retencao de backups
* restauracao testada em ambiente separado

Backup so e confiavel se a restauracao tambem for testada.
