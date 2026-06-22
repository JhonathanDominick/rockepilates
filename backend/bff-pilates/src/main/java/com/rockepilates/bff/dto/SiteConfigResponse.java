package com.rockepilates.bff.dto;

public record SiteConfigResponse(
        Long id,
        String chave,
        String valor,
        String tipo
) {
}