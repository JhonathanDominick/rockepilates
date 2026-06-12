CREATE TABLE auditoria_redefinicao_senha_aluno (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL,
    admin_id BIGINT NOT NULL,
    admin_email VARCHAR(150) NOT NULL,
    admin_role VARCHAR(30) NOT NULL,
    realizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditoria_redef_senha_aluno_id
    ON auditoria_redefinicao_senha_aluno (aluno_id);

CREATE INDEX idx_auditoria_redef_senha_admin_id
    ON auditoria_redefinicao_senha_aluno (admin_id);

CREATE INDEX idx_auditoria_redef_senha_realizado_em
    ON auditoria_redefinicao_senha_aluno (realizado_em);
