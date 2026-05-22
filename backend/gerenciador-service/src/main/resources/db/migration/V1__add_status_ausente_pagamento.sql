ALTER TABLE pagamento
DROP CONSTRAINT IF EXISTS pagamento_status_check;

ALTER TABLE pagamento
    ADD CONSTRAINT pagamento_status_check
        CHECK (status IN ('PENDENTE', 'PAGO', 'ATRASADO', 'AUSENTE', 'CANCELADO'));