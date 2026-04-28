package com.rockepilates.bff.exception;

import com.rockepilates.bff.dto.ErrorResponse;
import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 🔴 ERRO DO CIRCUIT BREAKER + FEIGN
    @ExceptionHandler(NoFallbackAvailableException.class)
    public ResponseEntity<ErrorResponse> handleNoFallbackAvailableException(
            NoFallbackAvailableException ex,
            HttpServletRequest request
    ) {
        Throwable cause = ex.getCause();

        if (cause instanceof FeignException feignException) {
            HttpStatus status = HttpStatus.valueOf(feignException.status());

            String mensagem = extrairMensagemFeign(feignException);

            ErrorResponse error = new ErrorResponse(
                    LocalDateTime.now(),
                    status.value(),
                    mensagem,
                    request.getRequestURI()
            );

            return ResponseEntity.status(status).body(error);
        }

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                "Serviço indisponível",
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }

    // 🔴 ERROS MAPEADOS (FeignErrorHandler)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(
            ResponseStatusException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());

        log.warn("Erro tratado no BFF. status={}, message={}", status.value(), ex.getReason());

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                ex.getReason(),
                request.getRequestURI()
        );

        return ResponseEntity.status(status).body(error);
    }

    // 🔴 SERVIÇO FORA DO AR
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalStateException(
            IllegalStateException ex,
            HttpServletRequest request
    ) {
        log.error("Erro de comunicação com usuarios-service", ex);

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(error);
    }

    // 🔴 EXCEPTION DE INTEGRAÇÃO
    @ExceptionHandler(UsuariosServiceIntegrationException.class)
    public ResponseEntity<ErrorResponse> handleUsuariosServiceIntegrationException(
            UsuariosServiceIntegrationException ex,
            HttpServletRequest request
    ) {
        log.error("Erro de integração com usuarios-service", ex);

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(error);
    }

    // 🔴 FALLBACK FINAL
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request
    ) {
        log.error("Erro interno no BFF", ex);

        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro interno no BFF",
                request.getRequestURI()
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

    // 🔧 EXTRAI A MENSAGEM LIMPA DO FEIGN
    private String extrairMensagemFeign(FeignException ex) {
        String body = ex.contentUTF8();

        if (body == null || body.isBlank()) {
            return ex.getMessage();
        }

        try {
            int messageIndex = body.indexOf("\"message\":\"");

            if (messageIndex == -1) {
                return body;
            }

            int start = messageIndex + "\"message\":\"".length();
            int end = body.indexOf("\"", start);

            if (end == -1) {
                return body;
            }

            return body.substring(start, end);
        } catch (Exception e) {
            return body;
        }
    }
}