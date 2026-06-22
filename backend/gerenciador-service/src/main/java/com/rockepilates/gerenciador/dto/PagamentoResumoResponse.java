package com.rockepilates.gerenciador.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PagamentoResumoResponse(
        Long id,
        String aluno,
        BigDecimal valor,
        String status,
        LocalDate dataPagamento,
        LocalDate dataVencimento
) {
}