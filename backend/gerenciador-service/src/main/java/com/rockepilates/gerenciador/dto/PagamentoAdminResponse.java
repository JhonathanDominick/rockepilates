package com.rockepilates.gerenciador.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PagamentoAdminResponse(
        Long id,
        Long assinaturaId,
        String aluno,
        String plano,
        BigDecimal valor,
        String status,
        LocalDate dataPagamento,
        LocalDate dataVencimento
) {
}