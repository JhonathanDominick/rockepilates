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
import com.rockepilates.gerenciador.security.JwtAlunoService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
    private final JwtAlunoService jwtAlunoService;

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

        LocalDate dataInicio = request.dataInicioAssinatura();

        LocalDate primeiroVencimento =
                dataInicio.plusMonths(plano.getDuracaoMeses());

        validarDataInicioNovoAluno(dataInicio);

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

        Assinatura assinatura = Assinatura.builder()
                .aluno(aluno)
                .plano(plano)
                .dataInicio(dataInicio)
                .dataVencimento(primeiroVencimento)
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
                .dataVencimento(primeiroVencimento)
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

        String token = jwtAlunoService.generateToken(
                aluno.getId(),
                aluno.getEmail()
        );

        return new LoginAlunoResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                token
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

        String statusPagamento = resolverStatusFinanceiroAluno(assinatura);

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
                assinatura.getDataCancelamento(),
                aluno.getMensagemProfessora()
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
                            assinatura.getAluno().getObservacoesInternas(),
                            assinatura.getAluno().getMensagemProfessora()
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
                .findFirstByAssinaturaAndStatusInOrderByDataVencimentoDesc(
                        assinatura,
                        List.of(
                                StatusPagamento.PENDENTE,
                                StatusPagamento.ATRASADO
                        )
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pagamento pendente ou atrasado não encontrado"));

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

    public List<PagamentoResponse> listarPagamentosPorAluno(Long alunoId) {

        if (!alunoRepository.existsById(alunoId)) {
            throw new ResourceNotFoundException("Aluno não encontrado");
        }

        return pagamentoRepository.findByAssinaturaAlunoIdOrderByDataVencimentoDesc(alunoId)
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

    public PagamentoPaginadoResponse listarPagamentosPorAlunoPaginado(
            Long alunoId,
            String status,
            String inicio,
            String fim,
            int page,
            int size
    ) {
        if (!alunoRepository.existsById(alunoId)) {
            throw new ResourceNotFoundException("Aluno não encontrado");
        }

        StatusPagamento statusPagamento = null;

        if (status != null && !status.isBlank() && !"TODOS".equalsIgnoreCase(status)) {
            try {
                statusPagamento = StatusPagamento.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Status de pagamento inválido");
            }
        }

        LocalDate dataInicio =
                inicio != null && !inicio.isBlank()
                        ? LocalDate.parse(inicio)
                        : null;

        LocalDate dataFim =
                fim != null && !fim.isBlank()
                        ? LocalDate.parse(fim)
                        : null;

        final StatusPagamento filtroStatusPagamento = statusPagamento;
        final LocalDate filtroDataInicio = dataInicio;
        final LocalDate filtroDataFim = dataFim;

        int paginaSegura = Math.max(page, 0);
        int tamanhoSeguro = Math.min(Math.max(size, 1), 20);

        Pageable pageable = PageRequest.of(
                paginaSegura,
                tamanhoSeguro,
                Sort.by(Sort.Direction.DESC, "dataVencimento")
        );

        Specification<Pagamento> specification =
                (root, query, criteriaBuilder) -> {
                    var predicates = criteriaBuilder.conjunction();

                    predicates = criteriaBuilder.and(
                            predicates,
                            criteriaBuilder.equal(
                                    root.get("assinatura").get("aluno").get("id"),
                                    alunoId
                            )
                    );

                    if (filtroStatusPagamento != null) {
                        predicates = criteriaBuilder.and(
                                predicates,
                                criteriaBuilder.equal(
                                        root.get("status"),
                                        filtroStatusPagamento
                                )
                        );
                    }

                    if (filtroDataInicio != null) {
                        predicates = criteriaBuilder.and(
                                predicates,
                                criteriaBuilder.greaterThanOrEqualTo(
                                        root.get("dataVencimento"),
                                        filtroDataInicio
                                )
                        );
                    }

                    if (filtroDataFim != null) {
                        predicates = criteriaBuilder.and(
                                predicates,
                                criteriaBuilder.lessThanOrEqualTo(
                                        root.get("dataVencimento"),
                                        filtroDataFim
                                )
                        );
                    }

                    return predicates;
                };

        Page<Pagamento> pagamentos =
                pagamentoRepository.findAll(specification, pageable);

        List<PagamentoResponse> content = pagamentos
                .getContent()
                .stream()
                .map(pagamento -> new PagamentoResponse(
                        pagamento.getId(),
                        pagamento.getValor(),
                        pagamento.getDataVencimento(),
                        pagamento.getDataPagamento(),
                        pagamento.getStatus().name()
                ))
                .toList();

        return new PagamentoPaginadoResponse(
                content,
                pagamentos.getTotalElements(),
                pagamentos.getTotalPages(),
                pagamentos.getNumber(),
                pagamentos.getSize(),
                pagamentos.isFirst(),
                pagamentos.isLast()
        );
    }

    public ResumoFinanceiroAlunoResponse buscarResumoFinanceiroAluno(
            Long alunoId
    ) {

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

        String statusFinanceiro = resolverStatusFinanceiroAluno(assinatura);

        Long pagamentosPendentes =
                pagamentoRepository.countByAssinaturaAndStatus(
                        assinatura,
                        StatusPagamento.PENDENTE
                );

        Long pagamentosAtrasados =
                pagamentoRepository.countByAssinaturaAndStatus(
                        assinatura,
                        StatusPagamento.ATRASADO
                );

        LocalDate ultimoPagamentoConfirmado =
                pagamentoRepository
                        .findFirstByAssinaturaAndStatusOrderByDataPagamentoDesc(
                                assinatura,
                                StatusPagamento.PAGO
                        )
                        .map(Pagamento::getDataPagamento)
                        .orElse(null);

        return new ResumoFinanceiroAlunoResponse(
                assinatura.getStatus().name(),
                statusFinanceiro,
                pagamentosPendentes,
                pagamentosAtrasados,
                assinatura.getDataVencimento(),
                ultimoPagamentoConfirmado
        );
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
    public void atualizarMensagemProfessora(Long alunoId, String mensagemProfessora) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Aluno não encontrado"));

        aluno.setMensagemProfessora(mensagemProfessora);
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

    @Transactional
    public void alterarSenhaAluno(Long alunoId, AlterarSenhaAlunoRequest request) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Aluno não encontrado")
                );

        boolean senhaAtualValida = passwordEncoder.matches(
                request.senhaAtual(),
                aluno.getSenhaHash()
        );

        if (!senhaAtualValida) {
            throw new IllegalArgumentException("Senha atual inválida");
        }

        aluno.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
    }

    private void validarDataInicioNovoAluno(LocalDate dataInicio) {
        LocalDate primeiroDiaMesAtual = LocalDate.now().withDayOfMonth(1);

        if (dataInicio.isBefore(primeiroDiaMesAtual)) {
            throw new IllegalArgumentException(
                    "Para novo aluno, a data de início não pode ser anterior ao mês atual. Use a importação de aluno existente."
            );
        }
    }

    private String resolverStatusFinanceiroAluno(Assinatura assinatura) {
        if (assinatura.getStatus() == StatusAssinatura.CANCELADA) {
            return "CANCELADO";
        }

        Long pagamentosAtrasados = pagamentoRepository.countByAssinaturaAndStatus(
                assinatura,
                StatusPagamento.ATRASADO
        );

        if (pagamentosAtrasados > 0) {
            return "ATRASADO";
        }

        return pagamentoRepository
                .findFirstByAssinaturaOrderByDataVencimentoDesc(assinatura)
                .map(pagamento -> {
                    if (pagamento.getStatus() == StatusPagamento.PAGO) {
                        return "PAGO";
                    }

                    if (pagamento.getStatus() == StatusPagamento.CANCELADO) {
                        return "CANCELADO";
                    }

                    if (
                            pagamento.getStatus() == StatusPagamento.PENDENTE
                                    && !pagamento.getDataVencimento().isBefore(LocalDate.now())
                    ) {
                        return "EM_DIA";
                    }

                    if (
                            pagamento.getStatus() == StatusPagamento.PENDENTE
                                    && pagamento.getDataVencimento().isBefore(LocalDate.now())
                    ) {
                        return "PENDENTE";
                    }

                    if (pagamento.getStatus() == StatusPagamento.ATRASADO) {
                        return "ATRASADO";
                    }

                    return pagamento.getStatus().name();
                })
                .orElse("SEM_PAGAMENTO");
    }
}