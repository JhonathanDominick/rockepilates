package com.rockepilates.gerenciador.dto;

import com.rockepilates.gerenciador.enums.TipoPlano;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record ImportarAlunoRetroativoRequest(

        @NotBlank
        String nome,

        @NotBlank
        @Email
        String email,

        @NotBlank
        String telefone,

        @NotNull
        LocalDate dataNascimento,

        String objetivo,

        String observacoesSaude,

        @NotBlank
        String senha,

        @NotNull
        TipoPlano tipoPlano,

        @NotNull
        LocalDate dataInicioAssinatura,

        @Valid
        @NotEmpty
        List<PagamentoRetroativoRequest> pagamentos

) {
}