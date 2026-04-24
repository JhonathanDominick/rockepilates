package com.rockepilates.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUsuarioRequest(

        @NotBlank
        String nome,

        @Email
        @NotBlank
        String email
) {}