package com.rockepilates.gerenciador.controller;

import com.rockepilates.gerenciador.dto.*;
import com.rockepilates.gerenciador.service.AlunoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @PostMapping("/login")
    public LoginAlunoResponse login(@Valid @RequestBody LoginAlunoRequest request) {
        return service.loginAluno(request);
    }

    @GetMapping("/{id}/perfil")
    public AlunoPerfilResponse buscarPerfil(@PathVariable Long id) {
        return service.buscarPerfilAluno(id);
    }

    @GetMapping("/{id}/pagamentos")
    public List<PagamentoResponse> listarPagamentosPorAluno(@PathVariable Long id) {
        return service.listarPagamentosPorAluno(id);
    }

    @GetMapping("/{id}/pagamentos/paginado")
    public PagamentoPaginadoResponse listarPagamentosPorAlunoPaginado(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String inicio,
            @RequestParam(required = false) String fim,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return service.listarPagamentosPorAlunoPaginado(
                id,
                status,
                inicio,
                fim,
                page,
                size
        );
    }

    @PostMapping("/admin")
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrarAdmin(@Valid @RequestBody CadastroAdminAlunoRequest request) {
        service.cadastrarAdmin(request);
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

    @PatchMapping("/pagamentos/atualizar-atrasados")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarPagamentosAtrasados() {
        service.atualizarPagamentosAtrasados();
    }

    @GetMapping("/assinaturas/{id}/pagamentos")
    public List<PagamentoResponse> listarPagamentosPorAssinatura(@PathVariable Long id) {
        return service.listarPagamentosPorAssinatura(id);
    }

    @PatchMapping("/admin/{id}/observacoes-internas")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarObservacoesInternas(
            @PathVariable Long id,
            @RequestBody ObservacoesInternasRequest request
    ) {
        service.atualizarObservacoesInternas(
                id,
                request.observacoesInternas()
        );
    }

    @PatchMapping("/admin/{id}/mensagem-professora")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarMensagemProfessora(
            @PathVariable Long id,
            @RequestBody MensagemProfessoraRequest request
    ) {
        service.atualizarMensagemProfessora(
                id,
                request.mensagemProfessora()
        );
    }

    @PatchMapping("/admin/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarAdmin(
            @PathVariable Long id,
            @RequestBody AtualizarAlunoAdminRequest request
    ) {
        service.atualizarAdmin(id, request);
    }

    @PatchMapping("/assinaturas/{id}/cancelar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelarAssinatura(@PathVariable Long id) {
        service.cancelarAssinatura(id);
    }
}