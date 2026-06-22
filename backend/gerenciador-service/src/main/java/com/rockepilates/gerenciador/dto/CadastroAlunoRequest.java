package com.rockepilates.gerenciador.dto;

import com.rockepilates.gerenciador.enums.TipoPlano;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CadastroAlunoRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
        String nome,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        @Size(max = 150, message = "Email deve ter no máximo 150 caracteres")
        String email,

        @NotBlank(message = "Telefone é obrigatório")
        @Size(min = 8, max = 30, message = "Telefone deve ter entre 8 e 30 caracteres")
        String telefone,

        @NotNull(message = "Data de nascimento é obrigatória")
        @Past(message = "Data de nascimento deve estar no passado")
        LocalDate dataNascimento,

        @Size(max = 1000, message = "Objetivo deve ter no máximo 1000 caracteres")
        String objetivo,

        @Size(max = 1000, message = "Observações de saúde devem ter no máximo 1000 caracteres")
        String observacoesSaude,

        @NotNull(message = "Plano é obrigatório")
        TipoPlano tipoPlano,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres")
        String senha,

        @AssertTrue(message = "É necessário aceitar os termos")
        Boolean aceiteTermos
) {
}