package com.rockepilates.gerenciador.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RedefinirSenhaAlunoAdminRequest(

        @NotBlank(message = "Nova senha é obrigatória")
        @Size(min = 6, message = "Nova senha deve ter pelo menos 6 caracteres")
        String novaSenha,

        @NotBlank(message = "Confirmação da senha é obrigatória")
        String confirmarSenha
) {
}