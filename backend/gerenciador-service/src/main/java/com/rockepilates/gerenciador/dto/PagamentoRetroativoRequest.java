package com.rockepilates.gerenciador.dto;

import com.rockepilates.gerenciador.enums.StatusPagamento;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PagamentoRetroativoRequest(

        @NotNull
        LocalDate dataVencimento,

        LocalDate dataPagamento,

        @NotNull
        StatusPagamento status

) {
}