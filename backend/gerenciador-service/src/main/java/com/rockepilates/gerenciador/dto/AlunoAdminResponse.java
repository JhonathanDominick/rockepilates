package com.rockepilates.gerenciador.dto;

import java.time.LocalDate;

public record AlunoAdminResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        String plano,
        String status,
        LocalDate dataVencimento
) {}