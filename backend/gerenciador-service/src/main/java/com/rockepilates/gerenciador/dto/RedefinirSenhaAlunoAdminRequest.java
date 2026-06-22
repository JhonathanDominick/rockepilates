package com.rockepilates.gerenciador.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RedefinirSenhaAlunoAdminRequest(

        @NotBlank(message = "Nova senha e obrigatoria")
        @Size(min = 8, message = "Nova senha deve ter no minimo 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Nova senha deve conter pelo menos uma letra e um numero"
        )
        String novaSenha,

        @NotBlank(message = "Confirmacao da senha e obrigatoria")
        String confirmarSenha,

        @NotNull(message = "Identificador do administrador e obrigatorio")
        Long adminId,

        @NotBlank(message = "Email do administrador e obrigatorio")
        @Email(message = "Email do administrador e invalido")
        String adminEmail,

        @NotBlank(message = "Perfil do administrador e obrigatorio")
        String adminRole
) {
}
