package com.rockepilates.gerenciador.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardFinanceiroResponse(
        long totalAlunosAtivos,
        long pagamentosPendentes,
        long pagamentosAtrasados,
        BigDecimal faturamentoRecebidoMes,
        BigDecimal faturamentoPrevistoAberto,
        List<PagamentoResumoResponse> ultimosPagamentos,
        List<FaturamentoMensalResponse> faturamentoMensal
) {
}