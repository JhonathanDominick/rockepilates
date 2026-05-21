package com.rockepilates.gerenciador.dto;

import com.rockepilates.gerenciador.enums.TipoPlano;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record ImportarAlunoExistenteRequest(

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
        LocalDate dataInicioAssinatura,

        @NotBlank
        @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres")
        String senha,

        @NotEmpty
        List<@Valid PagamentoImportadoRequest> pagamentos
) {
}