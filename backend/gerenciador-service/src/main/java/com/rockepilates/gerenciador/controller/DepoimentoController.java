package com.rockepilates.gerenciador.controller;

import com.rockepilates.gerenciador.dto.DepoimentoRequest;
import com.rockepilates.gerenciador.entity.Depoimento;
import com.rockepilates.gerenciador.service.DepoimentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/depoimentos")
@RequiredArgsConstructor
public class DepoimentoController {

    private final DepoimentoService service;

    @PostMapping
    public Depoimento criar(@Valid @RequestBody DepoimentoRequest request) {
        return service.criar(request);
    }

    @GetMapping
    public List<Depoimento> listarAprovados() {
        return service.listarAprovados();
    }

    @GetMapping("/admin")
    public List<Depoimento> listarTodos() {
        return service.listarTodos();
    }

    @PatchMapping("/{id}/aprovar")
    public Depoimento aprovar(@PathVariable Long id) {
        return service.aprovar(id);
    }

    @PatchMapping("/{id}/desaprovar")
    public Depoimento desaprovar(@PathVariable Long id) {
        return service.desaprovar(id);
    }
}