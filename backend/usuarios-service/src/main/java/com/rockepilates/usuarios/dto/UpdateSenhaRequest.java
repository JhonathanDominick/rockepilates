package com.rockepilates.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateSenhaRequest(

        @NotBlank(message = "Senha atual e obrigatoria")
        String senhaAtual,

        @NotBlank(message = "Nova senha e obrigatoria")
        @Size(min = 8, message = "Nova senha deve ter no minimo 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Nova senha deve conter pelo menos uma letra e um numero"
        )
        String novaSenha
) {}