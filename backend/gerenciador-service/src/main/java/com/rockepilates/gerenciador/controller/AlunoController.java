package com.rockepilates.gerenciador.controller;

import com.rockepilates.gerenciador.dto.AlunoAdminResponse;
import com.rockepilates.gerenciador.dto.CadastroAlunoRequest;
import com.rockepilates.gerenciador.service.AlunoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import com.rockepilates.gerenciador.dto.PagamentoResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrar(@Valid @RequestBody CadastroAlunoRequest request) {
        service.cadastrar(request);
    }

    @GetMapping("/admin")
    public List<AlunoAdminResponse> listarAdmin() {
        return service.listarAdmin();
    }

    @PatchMapping("/assinaturas/{id}/pagar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void pagar(@PathVariable Long id) {
        service.marcarComoPago(id);
    }

    @GetMapping("/assinaturas/{id}/pagamentos")
    public List<PagamentoResponse> listarPagamentosPorAssinatura(@PathVariable Long id) {
        return service.listarPagamentosPorAssinatura(id);
    }
}