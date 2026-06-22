package com.rockepilates.gerenciador.dto;

import java.util.List;

public record PagamentoPaginadoResponse(
        List<PagamentoResponse> content,
        long totalElements,
        int totalPages,
        int page,
        int size,
        boolean first,
        boolean last
) {
}