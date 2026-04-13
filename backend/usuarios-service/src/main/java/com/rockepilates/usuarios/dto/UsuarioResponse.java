package com.rockepilates.usuarios.dto;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String role,
        Boolean ativo
) {}