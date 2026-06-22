package com.rockepilates.bff.exception;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FeignErrorHandler {

    public static RuntimeException handle(FeignException ex) {

        int status = ex.status();

        // 🔴 quando serviço está offline / timeout
        if (status == -1) {
            return new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "usuarios-service indisponível"
            );
        }

        HttpStatus httpStatus;

        try {
            httpStatus = HttpStatus.valueOf(status);
        } catch (Exception e) {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        // 🔴 limpa mensagem (Feign manda lixo às vezes)
        String message = extractMessage(ex);

        return new ResponseStatusException(httpStatus, message);
    }

    private static String extractMessage(FeignException ex) {
        try {
            return ex.contentUTF8();
        } catch (Exception e) {
            return "Erro ao comunicar com usuarios-service";
        }
    }
}