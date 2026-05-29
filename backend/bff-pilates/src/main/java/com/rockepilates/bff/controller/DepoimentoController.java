package com.rockepilates.bff.controller;

import com.rockepilates.bff.service.DepoimentoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import com.rockepilates.bff.dto.SuccessResponse;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
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
    public ResponseEntity<SuccessResponse<Map<String, Object>>> criar(@RequestBody Map<String, String> body) {

        Map<String, Object> data = service.criar(body);

        SuccessResponse<Map<String, Object>> response = new SuccessResponse<>(
                java.time.LocalDateTime.now(),
                201,
                "Depoimento enviado com sucesso",
                data
        );

        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<List<Map<String, Object>>>> listar() {

        List<Map<String, Object>> data = service.listar();

        SuccessResponse<List<Map<String, Object>>> response = new SuccessResponse<>(
                java.time.LocalDateTime.now(),
                200,
                "Depoimentos listados com sucesso",
                data
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin")
    public List<Map<String, Object>> listarAdmin(HttpServletRequest request) {
        return service.listarAdmin(request);
    }

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<SuccessResponse<Map<String, Object>>> aprovar(
            HttpServletRequest request,
            @PathVariable Long id
    ) {
        Map<String, Object> data = service.aprovar(request, id);

        SuccessResponse<Map<String, Object>> response = new SuccessResponse<>(
                LocalDateTime.now(),
                200,
                "Depoimento aprovado com sucesso",
                data
        );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/desaprovar")
    public ResponseEntity<SuccessResponse<Map<String, Object>>> desaprovar(
            HttpServletRequest request,
            @PathVariable Long id
    ) {
        Map<String, Object> data = service.desaprovar(request, id);

        SuccessResponse<Map<String, Object>> response = new SuccessResponse<>(
                LocalDateTime.now(),
                200,
                "Depoimento desaprovado com sucesso",
                data
        );

        return ResponseEntity.ok(response);
    }
}