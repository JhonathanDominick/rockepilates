package com.rockepilates.gerenciador.dto;

import java.util.List;

public record AlunoAdminPaginadoResponse(
        List<AlunoAdminResponse> content,
        long totalElements,
        int totalPages,
        int number,
        int size,
        boolean first,
        boolean last
) {
}