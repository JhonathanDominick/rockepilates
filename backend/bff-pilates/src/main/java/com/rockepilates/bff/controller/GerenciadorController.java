package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import com.rockepilates.bff.service.GerenciadorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bff/configs")
public class GerenciadorController {

    private final GerenciadorService service;

    public GerenciadorController(GerenciadorService service) {
        this.service = service;
    }

    @PostMapping
    public SiteConfigResponse salvar(@RequestBody SiteConfigRequest request) {
        return service.salvar(request);
    }

    @GetMapping("/{chave}")
    public SiteConfigResponse buscar(@PathVariable String chave) {
        return service.buscar(chave);
    }
}