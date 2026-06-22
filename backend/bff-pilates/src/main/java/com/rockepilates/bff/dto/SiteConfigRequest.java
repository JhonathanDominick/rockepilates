package com.rockepilates.bff.dto;

public record SiteConfigRequest(
        String chave,
        String valor,
        String tipo
) {
}