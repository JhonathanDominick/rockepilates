package com.rockepilates.gerenciador.dto;

import java.time.LocalDate;

public record AlunoAdminResponse(
        Long assinaturaId,
        Long alunoId,
        String nome,
        String email,
        String telefone,
        LocalDate dataNascimento,
        String objetivo,
        String observacoesSaude,
        String plano,
        String status,
        String statusPagamento,
        LocalDate dataVencimento,
        LocalDate dataCancelamento,
        String observacoesInternas,
        String mensagemProfessora
) {
}