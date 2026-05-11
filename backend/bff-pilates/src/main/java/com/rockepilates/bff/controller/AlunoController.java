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

    @PostMapping("/admin")
    public ResponseEntity<SuccessResponse<Void>> cadastrarAdmin(
            @RequestBody Map<String, Object> body,
            HttpServletRequest request
    ) {

        service.cadastrarAdmin(body, request);

        SuccessResponse<Void> response = new SuccessResponse<>(
                LocalDateTime.now(),
                201,
                "Aluno cadastrado com sucesso pelo admin",
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

    @PatchMapping("/assinaturas/{id}/pagar")
    public ResponseEntity<SuccessResponse<Void>> pagar(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        service.marcarComoPago(id, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Assinatura marcada como paga",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/assinaturas/{id}/pagamentos")
    public ResponseEntity<SuccessResponse<List<Map<String, Object>>>> listarPagamentosPorAssinatura(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        List<Map<String, Object>> data =
                service.listarPagamentosPorAssinatura(id, request);

        SuccessResponse<List<Map<String, Object>>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Histórico de pagamentos da assinatura",
                        data
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pagamentos/atualizar-atrasados")
    public ResponseEntity<SuccessResponse<Void>> atualizarPagamentosAtrasados(
            HttpServletRequest request
    ) {

        service.atualizarPagamentosAtrasados(request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Pagamentos atrasados atualizados com sucesso",
                        null
                );

        return ResponseEntity.ok(response);
    }

}