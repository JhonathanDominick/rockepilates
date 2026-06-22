package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.LoginRequest;
import com.rockepilates.bff.dto.LoginResponse;
import com.rockepilates.bff.service.LoginRateLimitService;
import com.rockepilates.bff.service.UsuariosService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class UsuariosControllerTest {

    private final UsuariosService usuariosService = mock(UsuariosService.class);
    private final LoginRateLimitService rateLimitService = mock(LoginRateLimitService.class);
    private final UsuariosController controller = new UsuariosController(usuariosService, rateLimitService);

    @Test
    void deveCriarCookieHttpOnlyNoLogin() {
        var request = new LoginRequest("admin@rockerpilates.test", "senha-segura");
        var httpRequest = new MockHttpServletRequest();
        when(rateLimitService.permitirTentativa("admin", httpRequest)).thenReturn(true);
        when(usuariosService.login(request)).thenReturn(new LoginResponse("jwt-ficticio"));

        ResponseEntity<Void> response = controller.login(request, httpRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getFirst("Set-Cookie"))
                .contains("admin_token=jwt-ficticio")
                .contains("Path=/")
                .contains("Max-Age=3600")
                .contains("HttpOnly")
                .contains("SameSite=Lax");
    }

    @Test
    void deveResponder429SemChamarLoginQuandoRateLimitBloquear() {
        var request = new LoginRequest("admin@rockerpilates.test", "senha-segura");
        var httpRequest = new MockHttpServletRequest();
        when(rateLimitService.permitirTentativa("admin", httpRequest)).thenReturn(false);

        ResponseEntity<Void> response = controller.login(request, httpRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS);
        verifyNoInteractions(usuariosService);
    }

    @Test
    void deveExpirarCookieNoLogout() {
        ResponseEntity<Void> response = controller.logout();

        assertThat(response.getHeaders().getFirst("Set-Cookie"))
                .contains("admin_token=")
                .contains("Max-Age=0")
                .contains("HttpOnly")
                .contains("SameSite=Lax");
    }
}
