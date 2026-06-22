package com.rockepilates.gerenciador.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepoimentoRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 80, message = "Nome deve ter entre 2 e 80 caracteres")
        String nome,

        @NotBlank(message = "Mensagem é obrigatória")
        @Size(min = 10, max = 500, message = "Mensagem deve ter entre 10 e 500 caracteres")
        String mensagem

) {}