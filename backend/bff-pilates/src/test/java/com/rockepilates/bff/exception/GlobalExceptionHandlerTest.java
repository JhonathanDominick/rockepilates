package com.rockepilates.bff.exception;

import com.rockepilates.bff.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void deveTraduzirIndisponibilidadeDeServicoPara503() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getRequestURI()).thenReturn("/bff/financeiro");

        ResponseEntity<ErrorResponse> response = handler.handleIllegalStateException(
                new IllegalStateException("gerenciador-service indisponível"),
                request
        );

        assertThat(response.getStatusCode().value()).isEqualTo(503);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().message()).isEqualTo("gerenciador-service indisponível");
        assertThat(response.getBody().path()).isEqualTo("/bff/financeiro");
    }
}

