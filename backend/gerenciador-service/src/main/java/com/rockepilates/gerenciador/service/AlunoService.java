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

import java.util.ArrayList;
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

        validarDataInicioNovoAluno(dataInicio);
        validarDataPagamentoPrimeiroCiclo(request.dataPagamentoPrimeiroCiclo());

        LocalDate primeiroVencimento = dataInicio;

        LocalDate proximoVencimento =
                primeiroVencimento.plusMonths(plano.getDuracaoMeses());

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
                .dataVencimento(proximoVencimento)
                .status(StatusAssinatura.ATIVA)
                .build();

        assinatura = assinaturaRepository.save(assinatura);

        Pagamento primeiroPagamento = Pagamento.builder()
                .assinatura(assinatura)
                .valor(plano.getValor())
                .dataVencimento(primeiroVencimento)
                .dataPagamento(request.dataPagamentoPrimeiroCiclo())
                .status(StatusPagamento.PAGO)
                .build();

        Pagamento proximoPagamento = Pagamento.builder()
                .assinatura(assinatura)
                .valor(plano.getValor())
                .dataVencimento(proximoVencimento)
                .dataPagamento(null)
                .status(StatusPagamento.PENDENTE)
                .build();

        pagamentoRepository.save(primeiroPagamento);
        pagamentoRepository.save(proximoPagamento);
    }

    @Transactional
    public void importarAlunoRetroativo(ImportarAlunoRetroativoRequest request) {

        if (alunoRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        Plano plano = planoRepository.findByTipoAndAtivoTrue(request.tipoPlano())
                .orElseThrow(() -> new IllegalArgumentException("Plano não encontrado"));

        validarImportacaoRetroativa(request, plano);

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

        List<PagamentoRetroativoRequest> pagamentosOrdenados =
                request.pagamentos()
                        .stream()
                        .sorted(Comparator.comparing(PagamentoRetroativoRequest::dataVencimento))
                        .toList();

        PagamentoRetroativoRequest ultimoPagamentoImportado =
                pagamentosOrdenados.get(pagamentosOrdenados.size() - 1);

        LocalDate dataVencimentoAssinatura =
                ultimoPagamentoImportado.dataVencimento();

        boolean ultimoCicloFoiPago =
                ultimoPagamentoImportado.status() == StatusPagamento.PAGO;

        if (ultimoCicloFoiPago) {
            dataVencimentoAssinatura =
                    ultimoPagamentoImportado
                            .dataVencimento()
                            .plusMonths(plano.getDuracaoMeses());
        }

        Assinatura assinatura = Assinatura.builder()
                .aluno(aluno)
                .plano(plano)
                .dataInicio(request.dataInicioAssinatura())
                .dataVencimento(dataVencimentoAssinatura)
                .status(StatusAssinatura.ATIVA)
                .build();

        assinatura = assinaturaRepository.save(assinatura);

        List<Pagamento> pagamentos = new ArrayList<>();

        for (PagamentoRetroativoRequest pagamentoRequest : pagamentosOrdenados) {
            Pagamento pagamento = Pagamento.builder()
                    .assinatura(assinatura)
                    .valor(plano.getValor())
                    .dataVencimento(pagamentoRequest.dataVencimento())
                    .dataPagamento(
                            pagamentoRequest.status() == StatusPagamento.PAGO
                                    ? pagamentoRequest.dataPagamento()
                                    : null
                    )
                    .status(pagamentoRequest.status())
                    .build();

            pagamentos.add(pagamento);
        }

        if (ultimoCicloFoiPago) {
            Pagamento proximoPagamento = Pagamento.builder()
                    .assinatura(assinatura)
                    .valor(plano.getValor())
                    .dataVencimento(dataVencimentoAssinatura)
                    .dataPagamento(null)
                    .status(StatusPagamento.PENDENTE)
                    .build();

            pagamentos.add(proximoPagamento);
        }

        pagamentoRepository.saveAll(pagamentos);
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
                    String statusPagamento = resolverStatusFinanceiroAdmin(assinatura);

                    Pagamento pagamentoAtual = pagamentoRepository
                            .findFirstByAssinaturaOrderByDataVencimentoDesc(assinatura)
                            .orElse(null);

                    Long pagamentoAtualId =
                            pagamentoAtual != null
                                    ? pagamentoAtual.getId()
                                    : null;

                    String statusPagamentoAtual =
                            pagamentoAtual != null
                                    ? pagamentoAtual.getStatus().name()
                                    : "SEM_PAGAMENTO";

                    LocalDate dataVencimentoAtual =
                            pagamentoAtual != null
                                    ? pagamentoAtual.getDataVencimento()
                                    : assinatura.getDataVencimento();

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
                            pagamentoAtualId,
                            statusPagamentoAtual,
                            dataVencimentoAtual,
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
    public void marcarComoAusente(Long assinaturaId) {

        Assinatura assinatura = assinaturaRepository.findById(assinaturaId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Assinatura não encontrada")
                );

        if (assinatura.getStatus() == StatusAssinatura.CANCELADA) {
            throw new IllegalStateException(
                    "Não é possível marcar ausência em uma assinatura cancelada"
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
                        new ResourceNotFoundException("Pagamento pendente ou atrasado não encontrado")
                );

        pagamento.setStatus(StatusPagamento.AUSENTE);
        pagamento.setDataPagamento(null);

        pagamentoRepository.save(pagamento);
    }

    @Transactional
    public void marcarPagamentoComoAusente(Long pagamentoId) {

        Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pagamento não encontrado")
                );

        if (pagamento.getAssinatura().getStatus() == StatusAssinatura.CANCELADA) {
            throw new IllegalStateException(
                    "Não é possível marcar ausência em uma assinatura cancelada"
            );
        }

        if (
                pagamento.getStatus() != StatusPagamento.PENDENTE &&
                        pagamento.getStatus() != StatusPagamento.ATRASADO
        ) {
            throw new IllegalStateException(
                    "Só é possível marcar como ausente pagamentos pendentes ou atrasados"
            );
        }

        pagamento.setStatus(StatusPagamento.AUSENTE);
        pagamento.setDataPagamento(null);

        pagamentoRepository.save(pagamento);
    }

    @Transactional
    public void marcarPagamentoComoPago(Long pagamentoId) {

        Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pagamento não encontrado")
                );

        Assinatura assinatura = pagamento.getAssinatura();

        if (assinatura.getStatus() == StatusAssinatura.CANCELADA) {
            throw new IllegalStateException(
                    "Não é possível marcar pagamento de uma assinatura cancelada"
            );
        }

        if (
                pagamento.getStatus() != StatusPagamento.PENDENTE &&
                        pagamento.getStatus() != StatusPagamento.ATRASADO
        ) {
            throw new IllegalStateException(
                    "Só é possível marcar como pago pagamentos pendentes ou atrasados"
            );
        }

        pagamento.setStatus(StatusPagamento.PAGO);
        pagamento.setDataPagamento(LocalDate.now());

        Pagamento ultimoPagamento = pagamentoRepository
                .findFirstByAssinaturaOrderByDataVencimentoDesc(assinatura)
                .orElse(pagamento);

        boolean pagamentoEhUltimoCiclo =
                ultimoPagamento.getId().equals(pagamento.getId());

        if (pagamentoEhUltimoCiclo) {
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

            pagamentoRepository.save(proximoPagamento);
            assinaturaRepository.save(assinatura);
        }

        pagamentoRepository.save(pagamento);
    }

    @Transactional
    public void reverterPagamentoAusenteParaPendente(Long pagamentoId) {

        Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pagamento não encontrado")
                );

        if (pagamento.getAssinatura().getStatus() == StatusAssinatura.CANCELADA) {
            throw new IllegalStateException(
                    "Não é possível reverter pagamento de uma assinatura cancelada"
            );
        }

        if (pagamento.getStatus() != StatusPagamento.AUSENTE) {
            throw new IllegalStateException(
                    "Só é possível reverter pagamentos com status AUSENTE"
            );
        }

        pagamento.setStatus(StatusPagamento.PENDENTE);
        pagamento.setDataPagamento(null);

        pagamentoRepository.save(pagamento);
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

    private void validarDataPagamentoPrimeiroCiclo(LocalDate dataPagamentoPrimeiroCiclo) {

        if (dataPagamentoPrimeiroCiclo == null) {
            throw new IllegalArgumentException(
                    "Data de pagamento do primeiro ciclo é obrigatória"
            );
        }

        if (dataPagamentoPrimeiroCiclo.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Data de pagamento do primeiro ciclo não pode ser futura"
            );
        }
    }

    private String resolverStatusFinanceiroAluno(Assinatura assinatura) {

        if (assinatura.getStatus() == StatusAssinatura.CANCELADA) {
            return "CANCELADO";
        }

        Long pagamentosAtrasados =
                pagamentoRepository.countByAssinaturaAndStatus(
                        assinatura,
                        StatusPagamento.ATRASADO
                );

        if (pagamentosAtrasados > 0) {
            return "ATRASADO";
        }

        return pagamentoRepository
                .findFirstByAssinaturaOrderByDataVencimentoDesc(assinatura)
                .map(pagamento -> {

                    if (pagamento.getStatus() == StatusPagamento.AUSENTE) {
                        return "EM_DIA";
                    }

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

    private String resolverStatusFinanceiroAdmin(Assinatura assinatura) {

        if (assinatura.getStatus() == StatusAssinatura.CANCELADA) {
            return "CANCELADO";
        }

        List<Pagamento> pagamentos =
                pagamentoRepository.findByAssinaturaIdOrderByDataVencimentoDesc(
                        assinatura.getId()
                );

        if (pagamentos.isEmpty()) {
            return "SEM_PAGAMENTO";
        }

        LocalDate hoje = LocalDate.now();
        LocalDate primeiroDiaMesAtual = hoje.withDayOfMonth(1);
        LocalDate ultimoDiaMesAtual = primeiroDiaMesAtual.plusMonths(1).minusDays(1);

        boolean existeAtrasado = pagamentos
                .stream()
                .anyMatch(pagamento ->
                        pagamento.getStatus() == StatusPagamento.ATRASADO
                                || (
                                pagamento.getStatus() == StatusPagamento.PENDENTE
                                        && pagamento.getDataVencimento().isBefore(hoje)
                        )
                );

        if (existeAtrasado) {
            return "ATRASADO";
        }

        boolean existePendenteNoMesAtual = pagamentos
                .stream()
                .anyMatch(pagamento ->
                        pagamento.getStatus() == StatusPagamento.PENDENTE
                                && !pagamento.getDataVencimento().isBefore(primeiroDiaMesAtual)
                                && !pagamento.getDataVencimento().isAfter(ultimoDiaMesAtual)
                );

        if (existePendenteNoMesAtual) {
            return "PENDENTE";
        }

        Pagamento ultimoPagamento = pagamentos.get(0);

        if (ultimoPagamento.getStatus() == StatusPagamento.AUSENTE) {
            return "AUSENTE";
        }

        if (ultimoPagamento.getStatus() == StatusPagamento.CANCELADO) {
            return "CANCELADO";
        }

        return "EM_DIA";
    }

    private void validarImportacaoRetroativa(
            ImportarAlunoRetroativoRequest request,
            Plano plano
    ) {

        LocalDate hoje = LocalDate.now();
        LocalDate primeiroDiaMesAtual = hoje.withDayOfMonth(1);
        LocalDate ultimoDiaMesAtual = primeiroDiaMesAtual.plusMonths(1).minusDays(1);

        if (request.dataInicioAssinatura() == null) {
            throw new IllegalArgumentException(
                    "Data de início da assinatura é obrigatória"
            );
        }

        if (!request.dataInicioAssinatura().isBefore(primeiroDiaMesAtual)) {
            throw new IllegalArgumentException(
                    "A importação retroativa deve ser usada apenas para alunos com início anterior ao mês atual"
            );
        }

        if (request.pagamentos() == null || request.pagamentos().isEmpty()) {
            throw new IllegalArgumentException(
                    "Informe ao menos um pagamento para a importação retroativa"
            );
        }

        for (PagamentoRetroativoRequest pagamento : request.pagamentos()) {

            if (pagamento.dataVencimento() == null) {
                throw new IllegalArgumentException(
                        "Todos os pagamentos precisam ter data de vencimento"
                );
            }

            if (pagamento.status() == null) {
                throw new IllegalArgumentException(
                        "Todos os pagamentos precisam ter status"
                );
            }
        }

        List<PagamentoRetroativoRequest> pagamentosOrdenados =
                request.pagamentos()
                        .stream()
                        .sorted(Comparator.comparing(PagamentoRetroativoRequest::dataVencimento))
                        .toList();

        PagamentoRetroativoRequest primeiroPagamento = pagamentosOrdenados.get(0);

        if (!primeiroPagamento.dataVencimento().equals(request.dataInicioAssinatura())) {
            throw new IllegalArgumentException(
                    "O vencimento do primeiro ciclo financeiro deve ser igual à data de início da assinatura"
            );
        }

        if (primeiroPagamento.status() != StatusPagamento.PAGO) {
            throw new IllegalArgumentException(
                    "O primeiro ciclo financeiro deve estar com status PAGO"
            );
        }

        if (primeiroPagamento.dataPagamento() == null) {
            throw new IllegalArgumentException(
                    "O primeiro ciclo financeiro precisa ter data de pagamento"
            );
        }

        if (primeiroPagamento.dataPagamento().isAfter(hoje)) {
            throw new IllegalArgumentException(
                    "A data de pagamento do primeiro ciclo não pode ser futura"
            );
        }

        List<LocalDate> vencimentosRecebidos =
                pagamentosOrdenados
                        .stream()
                        .map(PagamentoRetroativoRequest::dataVencimento)
                        .toList();

        List<LocalDate> vencimentosEsperados = new ArrayList<>();

        LocalDate vencimentoEsperado = request.dataInicioAssinatura();

        while (!vencimentoEsperado.isAfter(ultimoDiaMesAtual)) {
            vencimentosEsperados.add(vencimentoEsperado);
            vencimentoEsperado = vencimentoEsperado.plusMonths(plano.getDuracaoMeses());
        }

        if (!vencimentosRecebidos.equals(vencimentosEsperados)) {
            throw new IllegalArgumentException(
                    "A importação retroativa precisa conter todos os ciclos financeiros contínuos desde o início da assinatura até o ciclo atual"
            );
        }

        List<LocalDate> vencimentosUnicos = new ArrayList<>();

        for (PagamentoRetroativoRequest pagamento : pagamentosOrdenados) {

            if (vencimentosUnicos.contains(pagamento.dataVencimento())) {
                throw new IllegalArgumentException(
                        "Não é permitido importar dois ciclos com o mesmo vencimento"
                );
            }

            vencimentosUnicos.add(pagamento.dataVencimento());

            if (pagamento.dataVencimento().isBefore(request.dataInicioAssinatura())) {
                throw new IllegalArgumentException(
                        "Pagamento não pode ter vencimento anterior ao início da assinatura"
                );
            }

            if (pagamento.dataVencimento().isAfter(ultimoDiaMesAtual)) {
                throw new IllegalArgumentException(
                        "Importação retroativa não deve gerar pagamentos futuros"
                );
            }

            if (
                    pagamento.status() != StatusPagamento.PAGO
                            && pagamento.status() != StatusPagamento.ATRASADO
                            && pagamento.status() != StatusPagamento.AUSENTE
                            && pagamento.status() != StatusPagamento.PENDENTE
            ) {
                throw new IllegalArgumentException(
                        "Status inválido para importação retroativa"
                );
            }

            boolean pagamentoVencido =
                    pagamento.dataVencimento().isBefore(hoje);

            boolean pagamentoNoMesAtual =
                    !pagamento.dataVencimento().isBefore(primeiroDiaMesAtual)
                            && !pagamento.dataVencimento().isAfter(ultimoDiaMesAtual);

            if (pagamento.status() == StatusPagamento.PENDENTE && pagamentoVencido) {
                throw new IllegalArgumentException(
                        "Pagamento vencido não pode ser importado como PENDENTE"
                );
            }

            if (pagamento.status() == StatusPagamento.PENDENTE && !pagamentoNoMesAtual) {
                throw new IllegalArgumentException(
                        "Somente o ciclo atual ainda não vencido pode ser PENDENTE"
                );
            }

            if (pagamento.status() == StatusPagamento.ATRASADO && !pagamentoVencido) {
                throw new IllegalArgumentException(
                        "Pagamento ainda não vencido não pode ser importado como ATRASADO"
                );
            }

            if (pagamento.status() == StatusPagamento.PAGO && pagamento.dataPagamento() == null) {
                throw new IllegalArgumentException(
                        "Pagamento com status PAGO precisa ter data de pagamento"
                );
            }

            if (pagamento.status() != StatusPagamento.PAGO && pagamento.dataPagamento() != null) {
                throw new IllegalArgumentException(
                        "Somente pagamentos PAGO podem ter data de pagamento"
                );
            }

            if (
                    pagamento.dataPagamento() != null
                            && pagamento.dataPagamento().isAfter(hoje)
            ) {
                throw new IllegalArgumentException(
                        "Data de pagamento não pode ser futura"
                );
            }
        }
    }
}