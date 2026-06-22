package com.rockepilates.gerenciador.dto;

import com.rockepilates.gerenciador.entity.TipoConfig;

public record SiteConfigResponse(
        Long id,
        String chave,
        String valor,
        TipoConfig tipo
) {
}