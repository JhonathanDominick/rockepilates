package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.HealthResponse;
import com.rockepilates.bff.service.UsuariosService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private final UsuariosService usuariosService;

    public HealthController(UsuariosService usuariosService) {
        this.usuariosService = usuariosService;
    }

    @GetMapping("/bff/health")
    public HealthResponse health() {

        String usuariosStatus = usuariosService.verificarUsuariosService();

        return new HealthResponse(
                "UP",
                usuariosStatus
        );
    }
}