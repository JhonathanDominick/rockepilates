package com.rockepilates.bff.controller;

import com.rockepilates.bff.dto.SuccessResponse;
import com.rockepilates.bff.service.AlunoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bff/alunos")
public class AlunoController {

    private final AlunoService service;

    public AlunoController(AlunoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SuccessResponse<Void>> cadastrar(
            @RequestBody Map<String, Object> body
    ) {

        service.cadastrar(body);

        SuccessResponse<Void> response = new SuccessResponse<>(
                LocalDateTime.now(),
                201,
                "Cadastro realizado com sucesso",
                null
        );

        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<SuccessResponse<Void>> login(
            @RequestBody Map<String, Object> body
    ) {

        Map<String, Object> aluno = service.login(body);

        Object token = aluno.get("token");

        if (token == null) {
            throw new IllegalStateException(
                    "Resposta de login inválida"
            );
        }

        ResponseCookie cookie = ResponseCookie
                .from("aluno_token", String.valueOf(token))
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(60 * 60 * 24)
                .sameSite("Lax")
                .build();

        SuccessResponse<Void> response = new SuccessResponse<>(
                LocalDateTime.now(),
                200,
                "Login do aluno realizado com sucesso",
                null
        );

        return ResponseEntity
                .ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<SuccessResponse<Void>> logout() {

        ResponseCookie cookie = ResponseCookie
                .from("aluno_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        SuccessResponse<Void> response = new SuccessResponse<>(
                LocalDateTime.now(),
                200,
                "Logout do aluno realizado com sucesso",
                null
        );

        return ResponseEntity
                .ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<SuccessResponse<Map<String, Object>>> me(
            HttpServletRequest request
    ) {

        Map<String, Object> data =
                service.buscarPerfilAluno(request);

        SuccessResponse<Map<String, Object>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Perfil do aluno",
                        data
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/financeiro/resumo")
    public ResponseEntity<SuccessResponse<Map<String, Object>>> resumoFinanceiro(
            HttpServletRequest request
    ) {

        Map<String, Object> data =
                service.buscarResumoFinanceiroAluno(request);

        SuccessResponse<Map<String, Object>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Resumo financeiro do aluno",
                        data
                );

        return ResponseEntity.ok(response);
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

    @PostMapping("/admin/importar-retroativo")
    public ResponseEntity<SuccessResponse<Void>> importarAlunoRetroativo(
            @RequestBody Map<String, Object> body,
            HttpServletRequest request
    ) {

        service.importarAlunoRetroativo(body, request);

        SuccessResponse<Void> response = new SuccessResponse<>(
                LocalDateTime.now(),
                201,
                "Aluno retroativo importado com sucesso",
                null
        );

        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/admin")
    public ResponseEntity<SuccessResponse<List<Map<String, Object>>>> listarAdmin(
            HttpServletRequest request
    ) {

        List<Map<String, Object>> data =
                service.listarAdmin(request);

        SuccessResponse<List<Map<String, Object>>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Lista de alunos",
                        data
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/paginado")
    public ResponseEntity<SuccessResponse<Map<String, Object>>> listarAdminPaginado(
            HttpServletRequest request,
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String plano,
            @RequestParam(required = false) String statusAssinatura,
            @RequestParam(required = false) String statusFinanceiro,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Map<String, Object> data =
                service.listarAdminPaginado(
                        request,
                        busca,
                        plano,
                        statusAssinatura,
                        statusFinanceiro,
                        page,
                        size
                );

        SuccessResponse<Map<String, Object>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Lista paginada de alunos",
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

    @PatchMapping("/pagamentos/{id}/pagar")
    public ResponseEntity<SuccessResponse<Void>> marcarPagamentoComoPago(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        service.marcarPagamentoComoPago(id, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Pagamento marcado como pago com sucesso",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/assinaturas/{id}/ausente")
    public ResponseEntity<SuccessResponse<Void>> marcarComoAusente(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        service.marcarComoAusente(id, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Pagamento marcado como ausente",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pagamentos/{id}/ausente")
    public ResponseEntity<SuccessResponse<Void>> marcarPagamentoComoAusente(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        service.marcarPagamentoComoAusente(id, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Pagamento marcado como ausente",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pagamentos/{id}/reverter-ausente")
    public ResponseEntity<SuccessResponse<Void>> reverterPagamentoAusenteParaPendente(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        service.reverterPagamentoAusenteParaPendente(id, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Pagamento revertido para pendente com sucesso",
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

    @PatchMapping("/admin/{id}/observacoes-internas")
    public ResponseEntity<SuccessResponse<Void>> atualizarObservacoesInternas(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request
    ) {

        service.atualizarObservacoesInternas(
                id,
                body,
                request
        );

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Observações internas atualizadas com sucesso",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/{id}/mensagem-professora")
    public ResponseEntity<SuccessResponse<Void>> atualizarMensagemProfessora(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request
    ) {
        service.atualizarMensagemProfessora(id, body, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Mensagem da professora atualizada com sucesso",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/{id}")
    public ResponseEntity<SuccessResponse<Void>> atualizarAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request
    ) {

        service.atualizarAdmin(id, body, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Aluno atualizado com sucesso",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/{id}/senha")
    public ResponseEntity<SuccessResponse<Void>> redefinirSenhaAlunoAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request
    ) {

        service.redefinirSenhaAlunoAdmin(id, body, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Senha do aluno redefinida com sucesso",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/assinaturas/{id}/cancelar")
    public ResponseEntity<SuccessResponse<Void>> cancelarAssinatura(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        service.cancelarAssinatura(id, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Assinatura cancelada com sucesso",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/pagamentos")
    public ResponseEntity<SuccessResponse<List<Map<String, Object>>>> listarPagamentosAlunoLogado(
            HttpServletRequest request
    ) {

        List<Map<String, Object>> data =
                service.listarPagamentosAlunoLogado(request);

        SuccessResponse<List<Map<String, Object>>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Histórico financeiro do aluno",
                        data
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/pagamentos/paginado")
    public ResponseEntity<SuccessResponse<Map<String, Object>>> listarPagamentosAlunoLogadoPaginado(
            HttpServletRequest request,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String inicio,
            @RequestParam(required = false) String fim,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Map<String, Object> data =
                service.listarPagamentosAlunoLogadoPaginado(
                        request,
                        status,
                        inicio,
                        fim,
                        page,
                        size
                );

        SuccessResponse<Map<String, Object>> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Histórico financeiro paginado do aluno",
                        data
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/me/senha")
    public ResponseEntity<SuccessResponse<Void>> alterarSenhaAluno(
            @RequestBody Map<String, Object> body,
            HttpServletRequest request
    ) {
        service.alterarSenhaAluno(body, request);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        200,
                        "Senha alterada com sucesso",
                        null
                );

        return ResponseEntity.ok(response);
    }
}