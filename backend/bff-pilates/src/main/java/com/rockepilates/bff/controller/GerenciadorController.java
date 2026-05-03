package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import com.rockepilates.bff.service.GerenciadorService;
import jakarta.servlet.http.HttpServletRequest;
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
            HttpServletRequest request,
            @RequestBody SiteConfigRequest body
    ) {
        return service.salvar(request, body);
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