package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.SuccessResponse;
import com.rockepilates.bff.service.DashboardFinanceiroService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class DashboardFinanceiroController {

    private final DashboardFinanceiroService service;

    public DashboardFinanceiroController(DashboardFinanceiroService service) {
        this.service = service;
    }

    @GetMapping("/bff/dashboard/financeiro")
    public ResponseEntity<SuccessResponse<Map<String, Object>>> buscarDashboard(
            HttpServletRequest request
    ) {
        Map<String, Object> data = service.buscarDashboard(request);

        SuccessResponse<Map<String, Object>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Dashboard financeiro",
                        data
                );

        return ResponseEntity.ok(response);
    }
}