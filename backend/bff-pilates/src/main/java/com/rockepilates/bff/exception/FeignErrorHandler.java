package com.rockepilates.bff.exception;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class FeignErrorHandler {

    public static RuntimeException handle(FeignException ex) {

        int status = ex.status();

        if (status == 400) {
            return new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }

        if (status == 401) {
            return new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }

        if (status == 403) {
            return new ResponseStatusException(HttpStatus.FORBIDDEN, ex.getMessage());
        }

        if (status == 404) {
            return new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }

        if (status == 409) {
            return new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }

        return new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro ao comunicar com usuarios-service"
        );
    }
}