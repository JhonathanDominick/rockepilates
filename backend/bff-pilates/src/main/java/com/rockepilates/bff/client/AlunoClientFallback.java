package com.rockepilates.bff.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class AlunoClientFallback implements AlunoClient {

    private static final Logger log = LoggerFactory.getLogger(AlunoClientFallback.class);

    @Override
    public void cadastrar(Map<String, Object> body) {
        throw serviceUnavailable("cadastro de aluno");
    }

    @Override
    public Map<String, Object> login(Map<String, Object> body) {
        throw serviceUnavailable("login de aluno");
    }

    @Override
    public Map<String, Object> buscarPerfil(Long id) {
        throw serviceUnavailable("busca de perfil do aluno id=" + id);
    }

    @Override
    public Map<String, Object> buscarResumoFinanceiroAluno(Long id) {
        throw serviceUnavailable("resumo financeiro do aluno id=" + id);
    }

    @Override
    public List<Map<String, Object>> listarPagamentosPorAluno(Long id) {
        throw serviceUnavailable("listagem de pagamentos do aluno id=" + id);
    }

    @Override
    public void cadastrarAdmin(Map<String, Object> body) {
        throw serviceUnavailable("cadastro administrativo de aluno");
    }

    @Override
    public void importarAlunoRetroativo(Map<String, Object> body) {
        throw serviceUnavailable("importação retroativa de aluno");
    }

    @Override
    public List<Map<String, Object>> listarAdmin() {
        throw serviceUnavailable("listagem administrativa de alunos");
    }

    @Override
    public Map<String, Object> listarAdminPaginado(
            String busca,
            String plano,
            String statusAssinatura,
            String statusFinanceiro,
            int page,
            int size
    ) {
        throw serviceUnavailable("listagem administrativa paginada de alunos");
    }

    @Override
    public void marcarComoPago(Long id) {
        throw serviceUnavailable("marcação de assinatura como paga id=" + id);
    }

    @Override
    public void atualizarPagamentosAtrasados() {
        throw serviceUnavailable("atualização de pagamentos atrasados");
    }

    @Override
    public List<Map<String, Object>> listarPagamentosPorAssinatura(Long id) {
        throw serviceUnavailable("listagem de pagamentos da assinatura id=" + id);
    }

    @Override
    public void atualizarObservacoesInternas(Long id, Map<String, Object> body) {
        throw serviceUnavailable("atualização de observações internas do aluno id=" + id);
    }

    @Override
    public void atualizarMensagemProfessora(Long id, Map<String, Object> body) {
        throw serviceUnavailable("atualização de mensagem da professora do aluno id=" + id);
    }

    @Override
    public void atualizarAdmin(Long id, Map<String, Object> body) {
        throw serviceUnavailable("atualização administrativa do aluno id=" + id);
    }

    @Override
    public void cancelarAssinatura(Long id) {
        throw serviceUnavailable("cancelamento de assinatura id=" + id);
    }

    @Override
    public Map<String, Object> listarPagamentosPorAlunoPaginado(
            Long id,
            String status,
            String inicio,
            String fim,
            int page,
            int size
    ) {
        throw serviceUnavailable("listagem paginada de pagamentos do aluno id=" + id);
    }

    @Override
    public void alterarSenhaAluno(Long id, Map<String, Object> body) {
        throw serviceUnavailable("alteração de senha do aluno id=" + id);
    }

    @Override
    public void marcarComoAusente(Long id) {
        throw serviceUnavailable("marcação de ausência na assinatura id=" + id);
    }

    @Override
    public void marcarPagamentoComoPago(Long id) {
        throw serviceUnavailable("marcação de pagamento como pago id=" + id);
    }

    @Override
    public void marcarPagamentoComoAusente(Long id) {
        throw serviceUnavailable("marcação de pagamento como ausente id=" + id);
    }

    @Override
    public void reverterPagamentoAusenteParaPendente(Long id) {
        throw serviceUnavailable("reversão de pagamento ausente para pendente id=" + id);
    }

    @Override
    public void redefinirSenhaAlunoAdmin(Long id, Map<String, Object> body) {
        throw serviceUnavailable("redefinição administrativa de senha do aluno id=" + id);
    }

    @Override
    public Map<String, Object> validarSessaoAluno(Long id, Map<String, Object> body) {
        throw serviceUnavailable("validação de sessão do aluno id=" + id);
    }

    private IllegalStateException serviceUnavailable(String operation) {
        log.error("Fallback acionado para {}", operation);
        return new IllegalStateException("gerenciador-service indisponível");
    }
}
