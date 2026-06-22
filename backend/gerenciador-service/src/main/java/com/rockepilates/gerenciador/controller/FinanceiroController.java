package com.rockepilates.gerenciador.controller;

import com.rockepilates.gerenciador.dto.FinanceiroAdminResponse;
import com.rockepilates.gerenciador.service.FinanceiroService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class FinanceiroController {

    private final FinanceiroService service;

    @GetMapping("/financeiro/pagamentos")
    public FinanceiroAdminResponse listarPagamentos() {
        return service.listarPagamentos();
    }
}