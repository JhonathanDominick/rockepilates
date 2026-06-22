package com.rockepilates.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateUsuarioRequest(

        @NotBlank(message = "Nome e obrigatorio")
        String nome,

        @Email(message = "E-mail invalido")
        @NotBlank(message = "E-mail e obrigatorio")
        String email,

        @NotBlank(message = "Senha e obrigatoria")
        @Size(min = 8, message = "Senha deve ter no minimo 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Senha deve conter pelo menos uma letra e um numero"
        )
        String senha
) {}