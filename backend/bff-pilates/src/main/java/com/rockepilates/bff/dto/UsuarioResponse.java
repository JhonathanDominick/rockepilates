package com.rockepilates.bff.dto;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String role,
        Boolean ativo
) {
}