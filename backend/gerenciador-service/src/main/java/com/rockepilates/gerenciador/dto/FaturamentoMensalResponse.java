package com.rockepilates.gerenciador.dto;

import java.math.BigDecimal;

public record FaturamentoMensalResponse(
        String mes,
        BigDecimal valor
) {
}