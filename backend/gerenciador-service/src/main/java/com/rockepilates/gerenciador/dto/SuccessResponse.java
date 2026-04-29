package com.rockepilates.gerenciador.dto;

import java.time.LocalDateTime;

public record SuccessResponse<T>(
        LocalDateTime timestamp,
        int status,
        String message,
        T data
) {
}