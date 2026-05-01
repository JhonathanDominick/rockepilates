package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.*;
import com.rockepilates.bff.service.UsuariosService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UsuariosController {

    private final UsuariosService service;

    public UsuariosController(UsuariosService service) {
        this.service = service;
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
    public ResponseEntity<Void> login(@RequestBody LoginRequest request) {

        LoginResponse response = service.login(request);

        String token = response.token();

        ResponseCookie cookie = ResponseCookie.from("admin_token", token)
                .httpOnly(true)
                .secure(false) // depois vamos ajustar para true em produção
                .path("/")
                .maxAge(60 * 60) // 1 hora
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
                .secure(false)
                .path("/")
                .maxAge(0) // remove cookie
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