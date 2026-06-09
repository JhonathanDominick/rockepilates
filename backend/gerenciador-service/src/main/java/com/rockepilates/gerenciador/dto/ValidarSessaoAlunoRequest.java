package com.rockepilates.gerenciador.dto;

import jakarta.validation.constraints.NotNull;

public record ValidarSessaoAlunoRequest(
        @NotNull
        Long sessionVersion
) {
}
