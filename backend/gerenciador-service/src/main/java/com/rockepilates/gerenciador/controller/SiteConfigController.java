package com.rockepilates.gerenciador.controller;

import com.rockepilates.gerenciador.entity.SiteConfig;
import com.rockepilates.gerenciador.service.SiteConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/configs")
@RequiredArgsConstructor
public class SiteConfigController {

    private final SiteConfigService service;

    @PostMapping
    public SiteConfig salvar(@RequestParam String chave,
                             @RequestParam String valor) {
        return service.salvar(chave, valor);
    }

    @GetMapping("/{chave}")
    public SiteConfig buscar(@PathVariable String chave) {
        return service.buscarPorChave(chave);
    }
}