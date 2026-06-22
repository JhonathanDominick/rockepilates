package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.dto.AlterarSenhaAlunoRequest;
import com.rockepilates.gerenciador.dto.RedefinirSenhaAlunoAdminRequest;
import com.rockepilates.gerenciador.entity.Aluno;
import com.rockepilates.gerenciador.entity.Assinatura;
import com.rockepilates.gerenciador.entity.AuditoriaRedefinicaoSenhaAluno;
import com.rockepilates.gerenciador.entity.Pagamento;
import com.rockepilates.gerenciador.entity.Plano;
import com.rockepilates.gerenciador.enums.StatusAssinatura;
import com.rockepilates.gerenciador.enums.StatusPagamento;
import com.rockepilates.gerenciador.repository.AlunoRepository;
import com.rockepilates.gerenciador.repository.AssinaturaRepository;
import com.rockepilates.gerenciador.repository.AuditoriaRedefinicaoSenhaAlunoRepository;
import com.rockepilates.gerenciador.repository.PagamentoRepository;
import com.rockepilates.gerenciador.repository.PlanoRepository;
import com.rockepilates.gerenciador.security.JwtAlunoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlunoServiceTest {

    @Mock private AlunoRepository alunoRepository;
    @Mock private PlanoRepository planoRepository;
    @Mock private AssinaturaRepository assinaturaRepository;
    @Mock private PagamentoRepository pagamentoRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtAlunoService jwtAlunoService;
    @Mock private AuditoriaRedefinicaoSenhaAlunoRepository auditoriaRepository;

    private AlunoService service;

    @BeforeEach
    void setUp() {
        service = new AlunoService(
                alunoRepository,
                planoRepository,
                assinaturaRepository,
                pagamentoRepository,
                passwordEncoder,
                jwtAlunoService,
                auditoriaRepository
        );
    }

    @Test
    void naoDeveProcessarPagamentoJaPagoNovamente() {
        Pagamento pagamento = pagamento(StatusPagamento.PAGO);
        when(pagamentoRepository.findById(100L)).thenReturn(Optional.of(pagamento));

        assertThatThrownBy(() -> service.marcarPagamentoComoPago(100L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("pendentes ou atrasados");

        verify(assinaturaRepository, never()).save(any());
    }

    @Test
    void devePagarUltimoCicloEGerarSomenteOProximo() {
        Pagamento pagamento = pagamento(StatusPagamento.PENDENTE);
        when(pagamentoRepository.findById(100L)).thenReturn(Optional.of(pagamento));
        when(pagamentoRepository.findFirstByAssinaturaOrderByDataVencimentoDesc(pagamento.getAssinatura()))
                .thenReturn(Optional.of(pagamento));

        service.marcarPagamentoComoPago(100L);

        assertThat(pagamento.getStatus()).isEqualTo(StatusPagamento.PAGO);
        assertThat(pagamento.getDataPagamento()).isEqualTo(LocalDate.now());
        assertThat(pagamento.getAssinatura().getDataVencimento())
                .isEqualTo(pagamento.getDataVencimento().plusMonths(1));

        ArgumentCaptor<Pagamento> captor = ArgumentCaptor.forClass(Pagamento.class);
        verify(pagamentoRepository, org.mockito.Mockito.times(2)).save(captor.capture());

        Pagamento proximo = captor.getAllValues().stream()
                .filter(item -> item != pagamento)
                .findFirst()
                .orElseThrow();
        assertThat(proximo.getStatus()).isEqualTo(StatusPagamento.PENDENTE);
        assertThat(proximo.getDataVencimento()).isEqualTo(pagamento.getDataVencimento().plusMonths(1));
    }

    @Test
    void deveCancelarPendenciasEPreservarHistoricoPago() {
        Assinatura assinatura = assinatura();
        Pagamento pendente = pagamento(assinatura, 101L, StatusPagamento.PENDENTE);
        Pagamento atrasado = pagamento(assinatura, 102L, StatusPagamento.ATRASADO);
        Pagamento pago = pagamento(assinatura, 103L, StatusPagamento.PAGO);
        when(assinaturaRepository.findById(assinatura.getId())).thenReturn(Optional.of(assinatura));
        when(pagamentoRepository.findByAssinaturaIdOrderByDataVencimentoDesc(assinatura.getId()))
                .thenReturn(List.of(pendente, atrasado, pago));

        service.cancelarAssinatura(assinatura.getId());

        assertThat(assinatura.getStatus()).isEqualTo(StatusAssinatura.CANCELADA);
        assertThat(assinatura.getDataCancelamento()).isEqualTo(LocalDate.now());
        assertThat(pendente.getStatus()).isEqualTo(StatusPagamento.CANCELADO);
        assertThat(atrasado.getStatus()).isEqualTo(StatusPagamento.CANCELADO);
        assertThat(pago.getStatus()).isEqualTo(StatusPagamento.PAGO);
    }

    @Test
    void deveInvalidarSessaoAoAlterarSenha() {
        Aluno aluno = Aluno.builder().id(1L).senhaHash("hash-antigo").sessionVersion(4L).build();
        when(alunoRepository.findById(1L)).thenReturn(Optional.of(aluno));
        when(passwordEncoder.matches("SenhaAtual1", "hash-antigo")).thenReturn(true);
        when(passwordEncoder.encode("SenhaNova2")).thenReturn("hash-novo");

        service.alterarSenhaAluno(1L, new AlterarSenhaAlunoRequest("SenhaAtual1", "SenhaNova2"));

        assertThat(aluno.getSenhaHash()).isEqualTo("hash-novo");
        assertThat(aluno.getSessionVersion()).isEqualTo(5L);
    }

    @Test
    void deveAuditarRedefinicaoAdministrativa() {
        Aluno aluno = Aluno.builder().id(1L).sessionVersion(0L).build();
        when(alunoRepository.findById(1L)).thenReturn(Optional.of(aluno));
        when(passwordEncoder.encode("SenhaNova2")).thenReturn("hash-novo");

        service.redefinirSenhaAlunoAdmin(
                1L,
                new RedefinirSenhaAlunoAdminRequest(
                        "SenhaNova2",
                        "SenhaNova2",
                        99L,
                        "admin@example.com",
                        "ADMIN"
                )
        );

        assertThat(aluno.getSessionVersion()).isEqualTo(1L);
        ArgumentCaptor<AuditoriaRedefinicaoSenhaAluno> captor =
                ArgumentCaptor.forClass(AuditoriaRedefinicaoSenhaAluno.class);
        verify(auditoriaRepository).save(captor.capture());
        assertThat(captor.getValue().getAdminId()).isEqualTo(99L);
        assertThat(captor.getValue().getAlunoId()).isEqualTo(1L);
    }

    private Pagamento pagamento(StatusPagamento status) {
        return pagamento(assinatura(), 100L, status);
    }

    private Pagamento pagamento(Assinatura assinatura, Long id, StatusPagamento status) {
        return Pagamento.builder()
                .id(id)
                .assinatura(assinatura)
                .valor(new BigDecimal("150.00"))
                .dataVencimento(LocalDate.of(2026, 6, 10))
                .status(status)
                .build();
    }

    private Assinatura assinatura() {
        Plano plano = Plano.builder()
                .id(20L)
                .duracaoMeses(1)
                .valor(new BigDecimal("150.00"))
                .build();
        return Assinatura.builder()
                .id(30L)
                .plano(plano)
                .status(StatusAssinatura.ATIVA)
                .dataVencimento(LocalDate.of(2026, 6, 10))
                .build();
    }
}

