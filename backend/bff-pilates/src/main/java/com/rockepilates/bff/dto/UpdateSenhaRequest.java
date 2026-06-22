package com.rockepilates.bff.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateSenhaRequest(

        @NotBlank
        String senhaAtual,

        @NotBlank
        String novaSenha
) {
}