package com.rockepilates.gerenciador.controller;

import com.rockepilates.gerenciador.entity.Depoimento;
import com.rockepilates.gerenciador.service.DepoimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/depoimentos")
@RequiredArgsConstructor
public class DepoimentoController {

    private final DepoimentoService service;

    @PostMapping
    public Depoimento criar(@RequestBody Map<String, String> body) {
        return service.criar(
                body.get("nome"),
                body.get("mensagem")
        );
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