package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.UsuarioResponse;
import com.rockepilates.bff.service.UsuariosService;
import org.springframework.web.bind.annotation.*;

@RestController
public class UsuariosController {

    private final UsuariosService service;

    public UsuariosController(UsuariosService service) {
        this.service = service;
    }

    @GetMapping("/bff/usuarios/health")
    public String healthUsuarios() {
        return service.buscarHealthUsuarios();
    }

    @GetMapping("/bff/usuarios")
    public PagedResponse<UsuarioResponse> listarUsuarios(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return service.listarUsuarios(authorizationHeader, page, size);
    }
}