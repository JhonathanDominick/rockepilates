package com.rockepilates.bff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "alunoClient", url = "${gerenciador.url}", fallback = AlunoClientFallback.class)
public interface AlunoClient {

    @PostMapping("/alunos")
    void cadastrar(@RequestBody Map<String, Object> body);

    @PostMapping("/alunos/login")
    Map<String, Object> login(@RequestBody Map<String, Object> body);

    @GetMapping("/alunos/{id}/perfil")
    Map<String, Object> buscarPerfil(@PathVariable Long id);

    @GetMapping("/alunos/{id}/financeiro/resumo")
    Map<String, Object> buscarResumoFinanceiroAluno(
            @PathVariable Long id
    );

    @GetMapping("/alunos/{id}/pagamentos")
    List<Map<String, Object>> listarPagamentosPorAluno(@PathVariable Long id);

    @PostMapping("/alunos/admin")
    void cadastrarAdmin(@RequestBody Map<String, Object> body);

    @PostMapping("/alunos/admin/importar-retroativo")
    void importarAlunoRetroativo(@RequestBody Map<String, Object> body);

    @GetMapping("/alunos/admin")
    List<Map<String, Object>> listarAdmin();

    @GetMapping("/alunos/admin/paginado")
    Map<String, Object> listarAdminPaginado(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String plano,
            @RequestParam(required = false) String statusAssinatura,
            @RequestParam(required = false) String statusFinanceiro,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    );

    @PatchMapping("/alunos/assinaturas/{id}/pagar")
    void marcarComoPago(@PathVariable Long id);

    @PatchMapping("/alunos/pagamentos/atualizar-atrasados")
    void atualizarPagamentosAtrasados();

    @GetMapping("/alunos/assinaturas/{id}/pagamentos")
    List<Map<String, Object>> listarPagamentosPorAssinatura(@PathVariable Long id);

    @PatchMapping("/alunos/admin/{id}/observacoes-internas")
    void atualizarObservacoesInternas(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    );

    @PatchMapping("/alunos/admin/{id}/mensagem-professora")
    void atualizarMensagemProfessora(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    );

    @PatchMapping("/alunos/admin/{id}")
    void atualizarAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    );

    @PatchMapping("/alunos/assinaturas/{id}/cancelar")
    void cancelarAssinatura(@PathVariable Long id);

    @GetMapping("/alunos/{id}/pagamentos/paginado")
    Map<String, Object> listarPagamentosPorAlunoPaginado(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String inicio,
            @RequestParam(required = false) String fim,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    );

    @PatchMapping("/alunos/{id}/senha")
    void alterarSenhaAluno(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    );

    @PatchMapping("/alunos/assinaturas/{id}/ausente")
    void marcarComoAusente(@PathVariable Long id);

    @PatchMapping("/alunos/pagamentos/{id}/pagar")
    void marcarPagamentoComoPago(@PathVariable Long id);

    @PatchMapping("/alunos/pagamentos/{id}/ausente")
    void marcarPagamentoComoAusente(@PathVariable Long id);

    @PatchMapping("/alunos/pagamentos/{id}/reverter-ausente")
    void reverterPagamentoAusenteParaPendente(@PathVariable Long id);

    @PatchMapping("/alunos/admin/{id}/senha")
    void redefinirSenhaAlunoAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body
    );
}
