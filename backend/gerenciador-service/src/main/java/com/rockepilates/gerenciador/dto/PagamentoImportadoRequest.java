package com.rockepilates.gerenciador.dto;

import com.rockepilates.gerenciador.enums.StatusPagamento;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PagamentoImportadoRequest(

        @NotNull
        LocalDate dataVencimento,

        @NotNull
        StatusPagamento status
) {
}