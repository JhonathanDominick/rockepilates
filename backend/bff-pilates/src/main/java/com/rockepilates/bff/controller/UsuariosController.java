package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.CreateUsuarioRequest;
import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.UsuarioResponse;
import com.rockepilates.bff.service.UsuariosService;
import org.springframework.http.HttpStatus;
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
}