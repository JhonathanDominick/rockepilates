package com.rockepilates.bff.dto;

public record RedefinirSenhaAlunoAdminRequest(
        String novaSenha,
        String confirmarSenha,
        Long adminId,
        String adminEmail,
        String adminRole
) {
}
