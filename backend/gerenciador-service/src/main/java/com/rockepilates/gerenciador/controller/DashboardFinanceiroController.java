package com.rockepilates.gerenciador.controller;

import com.rockepilates.gerenciador.dto.DashboardFinanceiroResponse;
import com.rockepilates.gerenciador.service.DashboardFinanceiroService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardFinanceiroController {

    private final DashboardFinanceiroService service;

    @GetMapping("/dashboard/financeiro")
    public DashboardFinanceiroResponse buscarDashboard() {
        return service.buscarDashboard();
    }
}