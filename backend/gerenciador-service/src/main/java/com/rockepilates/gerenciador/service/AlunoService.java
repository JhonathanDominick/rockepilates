package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.dto.AlunoAdminResponse;
import com.rockepilates.gerenciador.dto.CadastroAlunoRequest;
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
                .status(StatusAssinatura.PENDENTE_PAGAMENTO)
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

    public List<AlunoAdminResponse> listarAdmin() {
        return assinaturaRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Assinatura::getCriadoEm).reversed())
                .map(assinatura -> new AlunoAdminResponse(
                        assinatura.getId(),
                        assinatura.getAluno().getId(),
                        assinatura.getAluno().getNome(),
                        assinatura.getAluno().getEmail(),
                        assinatura.getAluno().getTelefone(),
                        assinatura.getPlano().getTipo().name(),
                        assinatura.getStatus().name(),
                        assinatura.getDataVencimento()
                ))
                .toList();
    }

    @Transactional
    public void marcarComoPago(Long id) {

        Assinatura assinatura = assinaturaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Assinatura não encontrada"));

        Pagamento pagamento = pagamentoRepository
                .findFirstByAssinaturaAndStatusOrderByDataVencimentoDesc(
                        assinatura,
                        StatusPagamento.PENDENTE
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Pagamento pendente não encontrado"));

        pagamento.setStatus(StatusPagamento.PAGO);
        pagamento.setDataPagamento(LocalDate.now());

        assinatura.setStatus(StatusAssinatura.PAGA);
    }
}