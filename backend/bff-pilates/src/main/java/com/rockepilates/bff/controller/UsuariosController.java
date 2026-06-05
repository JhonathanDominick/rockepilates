package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.CreateUsuarioRequest;
import com.rockepilates.bff.dto.LoginRequest;
import com.rockepilates.bff.dto.LoginResponse;
import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.UpdateSenhaRequest;
import com.rockepilates.bff.dto.UsuarioResponse;
import com.rockepilates.bff.service.UsuariosService;
import com.rockepilates.bff.util.CookieSecurityUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import com.rockepilates.bff.service.LoginRateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
public class UsuariosController {

    private final UsuariosService service;
    private final LoginRateLimitService loginRateLimitService;

    public UsuariosController(
            UsuariosService service,
            LoginRateLimitService loginRateLimitService
    ) {
        this.service = service;
        this.loginRateLimitService = loginRateLimitService;
    }

    @GetMapping("/bff/usuarios")
    public PagedResponse<UsuarioResponse> listarUsuarios(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return service.listarUsuarios(authorizationHeader, page, size);
    }

    @GetMapping("/bff/usuarios/{id}")
    public UsuarioResponse buscarUsuarioPorId(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long id
    ) {
        return service.buscarUsuarioPorId(authorizationHeader, id);
    }

    @PostMapping("/bff/usuarios")
    public ResponseEntity<UsuarioResponse> criarUsuario(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CreateUsuarioRequest request
    ) {
        var usuario = service.criarUsuario(authorizationHeader, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    @PostMapping("/bff/usuarios/login")
    public ResponseEntity<Void> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {

        if (!loginRateLimitService.permitirTentativa("admin", httpRequest)) {
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .build();
        }

        LoginResponse response = service.login(request);

        String token = response.token();

        ResponseCookie cookie = ResponseCookie.from("admin_token", token)
                .httpOnly(true)
                .secure(CookieSecurityUtil.isSecureCookieEnabled())
                .path("/")
                .maxAge(60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .ok()
                .header("Set-Cookie", cookie.toString())
                .build();
    }

    @PostMapping("/bff/usuarios/logout")
    public ResponseEntity<Void> logout() {

        ResponseCookie cookie = ResponseCookie.from("admin_token", "")
                .httpOnly(true)
                .secure(CookieSecurityUtil.isSecureCookieEnabled())
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .ok()
                .header("Set-Cookie", cookie.toString())
                .build();
    }

    @PatchMapping("/bff/usuarios/{id}/senha")
    public ResponseEntity<Void> atualizarSenha(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long id,
            @RequestBody UpdateSenhaRequest request
    ) {
        service.atualizarSenha(authorizationHeader, id, request);
        return ResponseEntity.noContent().build();
    }
}