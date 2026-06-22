package com.rockepilates.gerenciador.dto;

import com.rockepilates.gerenciador.entity.TipoConfig;

public record SiteConfigRequest(
        String chave,
        String valor,
        TipoConfig tipo
) {
}