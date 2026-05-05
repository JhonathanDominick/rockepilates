package com.rockepilates.bff.controller;

import com.rockepilates.bff.service.DepoimentoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bff/depoimentos")
public class DepoimentoController {

    private final DepoimentoService service;

    public DepoimentoController(DepoimentoService service) {
        this.service = service;
    }

    @PostMapping
    public Map<String, Object> criar(@RequestBody Map<String, String> body) {
        return service.criar(body);
    }

    @GetMapping
    public List<Map<String, Object>> listar() {
        return service.listar();
    }

    @GetMapping("/admin")
    public List<Map<String, Object>> listarAdmin(HttpServletRequest request) {
        return service.listarAdmin(request);
    }

    @PatchMapping("/{id}/aprovar")
    public Map<String, Object> aprovar(HttpServletRequest request, @PathVariable Long id) {
        return service.aprovar(request, id);
    }

    @PatchMapping("/{id}/desaprovar")
    public Map<String, Object> desaprovar(HttpServletRequest request, @PathVariable Long id) {
        return service.desaprovar(request, id);
    }
}