package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.SuccessResponse;
import com.rockepilates.bff.service.AlunoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;


@RestController
@RequestMapping("/bff/alunos")
public class AlunoController {

    private final AlunoService service;

    public AlunoController(AlunoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SuccessResponse<Void>> cadastrar(@RequestBody Map<String, Object> body) {

        service.cadastrar(body);

        SuccessResponse<Void> response = new SuccessResponse<>(
                LocalDateTime.now(),
                201,
                "Cadastro realizado com sucesso",
                null
        );

        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/admin")
    public ResponseEntity<SuccessResponse<List<Map<String, Object>>>> listarAdmin(
            HttpServletRequest request
    ) {
        List<Map<String, Object>> data = service.listarAdmin(request);

        SuccessResponse<List<Map<String, Object>>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Lista de alunos",
                        data
                );

        return ResponseEntity.ok(response);
    }
}