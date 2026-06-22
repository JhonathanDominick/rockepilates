package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.SuccessResponse;
import com.rockepilates.bff.service.FinanceiroService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class FinanceiroController {

    private final FinanceiroService service;

    public FinanceiroController(FinanceiroService service) {
        this.service = service;
    }

    @GetMapping("/bff/financeiro/pagamentos")
    public ResponseEntity<SuccessResponse<Map<String, Object>>> listarPagamentos(
            HttpServletRequest request
    ) {
        Map<String, Object> data =
                service.listarPagamentos(request);

        SuccessResponse<Map<String, Object>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Lista de pagamentos",
                        data
                );

        return ResponseEntity.ok(response);
    }
}