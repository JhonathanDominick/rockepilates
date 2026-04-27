package com.rockepilates.bff.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateUsuarioRequest(

        @NotBlank
        String nome,

        @Email
        @NotBlank
        String email,

        @NotBlank
        String senha
) {
}