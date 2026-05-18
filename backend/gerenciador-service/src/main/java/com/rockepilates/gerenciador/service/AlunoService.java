package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.dto.*;
import com.rockepilates.gerenciador.entity.Aluno;
import com.rockepilates.gerenciador.entity.Assinatura;
import com.rockepilates.gerenciador.entity.Pagamento;
import com.rockepilates.gerenciador.entity.Plano;
import com.rockepilates.gerenciador.enums.StatusAssinatura;
import com.rockepilates.gerenciador.enums.StatusPagamento;
import com.rockepilates.gerenciador.exception.ResourceNotFoundException;
import com.rockepilates.gerenciador.repository.AlunoRepository;
import com.rockepilates.gerenciador.repository.AssinaturaRepository;
import com.rockepilates.gerenciador.repository.PagamentoRepository;
import com.rockepilates.gerenciador.repository.PlanoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final PlanoRepository planoRepository;
    private final AssinaturaRepository assinaturaRepository;
    private final PagamentoRepository pagamentoRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void cadastrar(CadastroAlunoRequest request) {

        if (alunoRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Plano plano = planoRepository.findByTipoAndAtivoTrue(request.tipoPlano())
                .orElseThrow(() -> new IllegalArgumentException("Plano não encontrado"));

        Aluno aluno = Aluno.builder()
                .nome(request.nome().trim())
                .email(request.email().trim().toLowerCase())
                .telefone(request.telefone().trim())
                .dataNascimento(request.dataNascimento())
                .objetivo(request.objetivo())
                .observacoesSaude(request.observacoesSaude())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .ativo(true)
                .build();

        aluno = alunoRepository.save(aluno);

        LocalDate dataInicio = LocalDate.now();
        LocalDate dataVencimento = dataInicio.plusMonths(plano.getDuracaoMeses());

        Assinatura assinatura = Assinatura.builder()
                .aluno(aluno)
                .plano(plano)
                .dataInicio(dataInicio)
                .dataVencimento(dataVencimento)
                .status(StatusAssinatura.ATIVA)
                .build();

        assinatura = assinaturaRepository.save(assinatura);

        Pagamento pagamento = Pagamento.builder()
                .assinatura(assinatura)
                .valor(plano.getValor())
                .dataVencimento(dataVencimento)
                .status(StatusPagamento.PENDENTE)
                .build();

        pagamentoRepository.save(pagamento);
    }

    @Transactional
    public void cadastrarAdmin(CadastroAdminAlunoRequest request) {

        if (alunoRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Plano plano = planoRepository.findByTipoAndAtivoTrue(request.tipoPlano())
                .orElseThrow(() -> new IllegalArgumentException("Plano não encontrado"));

        Aluno aluno = Aluno.builder()
                .nome(request.nome().trim())
                .email(request.email().trim().toLowerCase())
                .telefone(request.telefone().trim())
                .dataNascimento(request.dataNascimento())
                .objetivo(request.objetivo())
                .observacoesSaude(request.observacoesSaude())
                .ativo(true)
                .build();

        aluno = alunoRepository.save(aluno);

        LocalDate dataInicio = LocalDate.now();

        Assinatura assinatura = Assinatura.builder()
                .aluno(aluno)
                .plano(plano)
                .dataInicio(dataInicio)
                .dataVencimento(request.dataVencimento())
                .status(StatusAssinatura.ATIVA)
                .build();

        assinatura = assinaturaRepository.save(assinatura);

        StatusPagamento statusPagamento =
                request.pago()
                        ? StatusPagamento.PAGO
                        : StatusPagamento.PENDENTE;

        Pagamento pagamento = Pagamento.builder()
                .assinatura(assinatura)
                .valor(plano.getValor())
                .dataVencimento(request.dataVencimento())
                .dataPagamento(
                        request.pago()
                                ? LocalDate.now()
                                : null
                )
                .status(statusPagamento)
                .build();

        pagamentoRepository.save(pagamento);
    }

    public LoginAlunoResponse loginAluno(LoginAlunoRequest request) {

        Aluno aluno = alunoRepository.findByEmail(
                        request.email().trim().toLowerCase()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException("Email ou senha inválidos")
                );

        if (aluno.getSenhaHash() == null) {
            throw new IllegalArgumentException(
                    "Este aluno ainda não possui acesso ao portal"
            );
        }

        boolean senhaValida = passwordEncoder.matches(
                request.senha(),
                aluno.getSenhaHash()
        );

        if (!senhaValida) {
            throw new IllegalArgumentException("Email ou senha inválidos");
        }

        return new LoginAlunoResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail()
        );
    }

    public AlunoPerfilResponse buscarPerfilAluno(Long alunoId) {

        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Aluno não encontrado")
                );

        Assinatura assinatura = assinaturaRepository
                .findByAlunoIdOrderByCriadoEmDesc(alunoId)
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Assinatura não encontrada"
                        )
                );

        String statusPagamento = pagamentoRepository
                .findFirstByAssinaturaOrderByDataVencimentoDesc(assinatura)
                .map(pagamento -> pagamento.getStatus().name())
                .orElse("SEM_PAGAMENTO");

        return new AlunoPerfilResponse(
                aluno.getId(),
                assinatura.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getTelefone(),
                aluno.getDataNascimento(),
                aluno.getObjetivo(),
                aluno.getObservacoesSaude(),
                assinatura.getPlano().getTipo().name(),
                assinatura.getStatus().name(),
                statusPagamento,
                assinatura.getDataVencimento(),
                assinatura.getDataCancelamento()
        );
    }

    public List<AlunoAdminResponse> listarAdmin() {
        return assinaturaRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Assinatura::getCriadoEm).reversed())
                .map(assinatura -> {
                    String statusPagamento = pagamentoRepository
                            .findFirstByAssinaturaOrderByDataVencimentoDesc(assinatura)
                            .map(pagamento -> pagamento.getStatus().name())
                            .orElse("SEM_PAGAMENTO");

                    return new AlunoAdminResponse(
                            assinatura.getId(),
                            assinatura.getAluno().getId(),
                            assinatura.getAluno().getNome(),
                            assinatura.getAluno().getEmail(),
                            assinatura.getAluno().getTelefone(),
                            assinatura.getAluno().getDataNascimento(),
                            assinatura.getAluno().getObjetivo(),
                            assinatura.getAluno().getObservacoesSaude(),
                            assinatura.getPlano().getTipo().name(),
                            assinatura.getStatus().name(),
                            statusPagamento,
                            assinatura.getDataVencimento(),
                            assinatura.getDataCancelamento(),
                            assinatura.getAluno().getObservacoesInternas()
                    );
                })
                .toList();
    }

    @Transactional
    public void marcarComoPago(Long id) {

        Assinatura assinatura = assinaturaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Assinatura não encontrada"));

        if (assinatura.getStatus() == StatusAssinatura.CANCELADA) {
            throw new IllegalStateException(
                    "Não é possível marcar como paga uma assinatura cancelada"
            );
        }

        Pagamento pagamento = pagamentoRepository
                .findFirstByAssinaturaAndStatusOrderByDataVencimentoDesc(
                        assinatura,
                        StatusPagamento.PENDENTE
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pagamento pendente não encontrado"));

        pagamento.setStatus(StatusPagamento.PAGO);
        pagamento.setDataPagamento(LocalDate.now());

        LocalDate proximoVencimento =
                pagamento.getDataVencimento().plusMonths(
                        assinatura.getPlano().getDuracaoMeses()
                );

        assinatura.setDataVencimento(proximoVencimento);
        assinatura.setStatus(StatusAssinatura.ATIVA);

        Pagamento proximoPagamento = Pagamento.builder()
                .assinatura(assinatura)
                .valor(assinatura.getPlano().getValor())
                .dataVencimento(proximoVencimento)
                .status(StatusPagamento.PENDENTE)
                .build();

        pagamentoRepository.save(pagamento);
        assinaturaRepository.save(assinatura);
        pagamentoRepository.save(proximoPagamento);
    }

    public List<PagamentoResponse> listarPagamentosPorAssinatura(Long assinaturaId) {

        if (!assinaturaRepository.existsById(assinaturaId)) {
            throw new ResourceNotFoundException("Assinatura não encontrada");
        }

        return pagamentoRepository.findByAssinaturaIdOrderByDataVencimentoDesc(assinaturaId)
                .stream()
                .map(pagamento -> new PagamentoResponse(
                        pagamento.getId(),
                        pagamento.getValor(),
                        pagamento.getDataVencimento(),
                        pagamento.getDataPagamento(),
                        pagamento.getStatus().name()
                ))
                .toList();
    }

    @Transactional
    public void atualizarPagamentosAtrasados() {

        List<Pagamento> pagamentosVencidos =
                pagamentoRepository.findByStatusAndDataVencimentoBefore(
                        StatusPagamento.PENDENTE,
                        LocalDate.now()
                );

        pagamentosVencidos.forEach(pagamento ->
                pagamento.setStatus(StatusPagamento.ATRASADO)
        );

        pagamentoRepository.saveAll(pagamentosVencidos);
    }

    @Transactional
    public void atualizarObservacoesInternas(Long alunoId, String observacoesInternas) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Aluno não encontrado"));

        aluno.setObservacoesInternas(observacoesInternas);
    }

    @Transactional
    public void atualizarAdmin(Long alunoId, AtualizarAlunoAdminRequest request) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Aluno não encontrado"));

        aluno.setNome(request.nome().trim());
        aluno.setTelefone(request.telefone().trim());
        aluno.setDataNascimento(request.dataNascimento());
        aluno.setObjetivo(request.objetivo());
        aluno.setObservacoesSaude(request.observacoesSaude());
    }

    @Transactional
    public void cancelarAssinatura(Long assinaturaId) {

        Assinatura assinatura = assinaturaRepository.findById(assinaturaId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Assinatura não encontrada")
                );

        assinatura.setStatus(StatusAssinatura.CANCELADA);
        assinatura.setDataCancelamento(LocalDate.now());

        List<Pagamento> pagamentos =
                pagamentoRepository
                        .findByAssinaturaIdOrderByDataVencimentoDesc(assinaturaId);

        for (Pagamento pagamento : pagamentos) {

            if (
                    pagamento.getStatus() == StatusPagamento.PENDENTE
                            || pagamento.getStatus() == StatusPagamento.ATRASADO
            ) {
                pagamento.setStatus(StatusPagamento.CANCELADO);
            }
        }

        assinaturaRepository.save(assinatura);

        pagamentoRepository.saveAll(pagamentos);
    }
}