package com.rockepilates.gerenciador.dto;

import com.rockepilates.gerenciador.enums.TipoPlano;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CadastroAdminAlunoRequest(

        @NotBlank
        String nome,

        @Email
        @NotBlank
        String email,

        @NotBlank
        String telefone,

        @NotNull
        LocalDate dataNascimento,

        String objetivo,

        String observacoesSaude,

        @NotNull
        TipoPlano tipoPlano,

        @NotNull
        LocalDate dataVencimento,

        @NotNull
        Boolean pago,

        @NotBlank
        String senha
) {
}