package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import com.rockepilates.bff.service.GerenciadorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bff/configs")
public class GerenciadorController {

    private final GerenciadorService service;

    public GerenciadorController(GerenciadorService service) {
        this.service = service;
    }

    @PostMapping
    public SiteConfigResponse salvar(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody SiteConfigRequest request
    ) {
        return service.salvar(authorizationHeader, request);
    }

    @GetMapping
    public List<SiteConfigResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{chave}")
    public SiteConfigResponse buscar(@PathVariable String chave) {
        return service.buscar(chave);
    }
}