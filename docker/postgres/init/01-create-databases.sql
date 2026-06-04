SELECT 'CREATE DATABASE gerenciador_db'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'gerenciador_db'
)\gexec
