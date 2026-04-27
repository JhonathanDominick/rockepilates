package com.rockepilates.bff.dto;

import java.time.LocalDateTime;

public record SuccessResponse<T>(
        LocalDateTime timestamp,
        int status,
        String message,
        T data
) {
}