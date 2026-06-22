package com.rockepilates.gerenciador.dto;

import java.time.LocalDate;

public record AtualizarAlunoAdminRequest(
        String nome,
        String telefone,
        LocalDate dataNascimento,
        String objetivo,
        String observacoesSaude
) {
}