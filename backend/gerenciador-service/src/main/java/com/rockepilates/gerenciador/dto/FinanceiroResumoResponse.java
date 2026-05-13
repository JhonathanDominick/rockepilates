package com.rockepilates.gerenciador.dto;

import java.math.BigDecimal;

public record FinanceiroResumoResponse(
        BigDecimal recebidoMes,
        BigDecimal pendenteMes,
        BigDecimal atrasadoMes
) {
}