package com.rockepilates.gerenciador.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PagamentoResponse(
        Long id,
        BigDecimal valor,
        LocalDate dataVencimento,
        LocalDate dataPagamento,
        String status
) {
}