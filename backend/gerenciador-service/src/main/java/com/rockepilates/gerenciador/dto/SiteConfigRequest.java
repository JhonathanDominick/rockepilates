package com.rockepilates.gerenciador.dto;

import jakarta.validation.constraints.NotBlank;

public record SiteConfigRequest(
        @NotBlank(message = "A chave é obrigatória")
        String chave,

        @NotBlank(message = "O valor é obrigatório")
        String valor
) {
}