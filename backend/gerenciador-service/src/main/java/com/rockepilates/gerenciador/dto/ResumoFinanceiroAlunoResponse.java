package com.rockepilates.gerenciador.dto;

import java.time.LocalDate;

public record ResumoFinanceiroAlunoResponse(
        String statusAssinatura,
        String statusFinanceiro,
        Long pagamentosPendentes,
        Long pagamentosAtrasados,
        LocalDate proximoVencimento,
        LocalDate ultimoPagamentoConfirmado
) {
}