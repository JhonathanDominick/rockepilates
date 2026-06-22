package com.rockepilates.bff.service;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LoginRateLimitServiceTest {

    private final LoginRateLimitService service = new LoginRateLimitService();

    @Test
    void deveBloquearAsextaTentativaDoMesmoTipoEIp() {
        HttpServletRequest request = request("203.0.113.10", null, null);

        for (int tentativa = 0; tentativa < 5; tentativa++) {
            assertThat(service.permitirTentativa("admin", request)).isTrue();
        }

        assertThat(service.permitirTentativa("admin", request)).isFalse();
    }

    @Test
    void deveSepararLimitesPorTipoDeLogin() {
        HttpServletRequest request = request("203.0.113.11", null, null);

        for (int tentativa = 0; tentativa < 5; tentativa++) {
            service.permitirTentativa("admin", request);
        }

        assertThat(service.permitirTentativa("admin", request)).isFalse();
        assertThat(service.permitirTentativa("aluno", request)).isTrue();
    }

    @Test
    void deveUsarPrimeiroIpDoForwardedFor() {
        HttpServletRequest proxied = request(
                "127.0.0.1",
                "198.51.100.20, 10.0.0.2",
                "198.51.100.99"
        );
        HttpServletRequest direto = request("198.51.100.20", null, null);

        for (int tentativa = 0; tentativa < 5; tentativa++) {
            service.permitirTentativa("admin", proxied);
        }

        assertThat(service.permitirTentativa("admin", direto)).isFalse();
    }

    private HttpServletRequest request(String remoteAddr, String forwardedFor, String realIp) {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getRemoteAddr()).thenReturn(remoteAddr);
        when(request.getHeader("X-Forwarded-For")).thenReturn(forwardedFor);
        when(request.getHeader("X-Real-IP")).thenReturn(realIp);
        return request;
    }
}

