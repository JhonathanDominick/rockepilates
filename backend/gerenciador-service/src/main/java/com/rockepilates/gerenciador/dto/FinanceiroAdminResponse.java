package com.rockepilates.gerenciador.dto;

import java.util.List;

public record FinanceiroAdminResponse(
        FinanceiroResumoResponse resumo,
        List<PagamentoAdminResponse> pagamentos
) {
}