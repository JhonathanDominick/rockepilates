package com.rockepilates.usuarios.security;

public record AuthenticatedUser(
        Long id,
        String email
) {
}