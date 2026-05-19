package com.rockepilates.gerenciador.dto;

public record LoginAlunoResponse(
        Long alunoId,
        String nome,
        String email,
        String token
) {
}