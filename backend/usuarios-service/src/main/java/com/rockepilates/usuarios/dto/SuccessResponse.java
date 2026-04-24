package com.rockepilates.usuarios.dto;

import java.time.LocalDateTime;

public record SuccessResponse<T>(
        LocalDateTime timestamp,
        int status,
        String message,
        T data
) {
}
