package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.dto.FinanceiroAdminResponse;
import com.rockepilates.gerenciador.entity.Aluno;
import com.rockepilates.gerenciador.entity.Assinatura;
import com.rockepilates.gerenciador.entity.Pagamento;
import com.rockepilates.gerenciador.entity.Plano;
import com.rockepilates.gerenciador.enums.StatusPagamento;
import com.rockepilates.gerenciador.enums.TipoPlano;
import com.rockepilates.gerenciador.repository.PagamentoRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class FinanceiroServiceTest {

    private final PagamentoRepository repository = mock(PagamentoRepository.class);
    private final FinanceiroService service = new FinanceiroService(repository);

    @Test
    void deveCalcularResumoSemMisturarPagamentosForaDoMes() {
        LocalDate hoje = LocalDate.now();
        List<Pagamento> pagamentos = List.of(
                pagamento(1L, StatusPagamento.PAGO, "120.00", hoje, hoje),
                pagamento(2L, StatusPagamento.PAGO, "999.00", hoje.minusMonths(1), hoje.minusMonths(1)),
                pagamento(3L, StatusPagamento.PENDENTE, "150.00", null, hoje.withDayOfMonth(1)),
                pagamento(4L, StatusPagamento.PENDENTE, "777.00", null, hoje.plusMonths(1)),
                pagamento(5L, StatusPagamento.ATRASADO, "80.00", null, hoje.minusMonths(1))
        );
        when(repository.findAllByOrderByDataVencimentoDesc()).thenReturn(pagamentos);

        FinanceiroAdminResponse response = service.listarPagamentos();

        assertThat(response.resumo().recebidoMes()).isEqualByComparingTo("120.00");
        assertThat(response.resumo().pendenteMes()).isEqualByComparingTo("150.00");
        assertThat(response.resumo().atrasadoMes()).isEqualByComparingTo("80.00");
        assertThat(response.pagamentos()).hasSize(5);
    }

    private Pagamento pagamento(
            Long id,
            StatusPagamento status,
            String valor,
            LocalDate dataPagamento,
            LocalDate dataVencimento
    ) {
        Aluno aluno = Aluno.builder().id(10L).nome("Aluno Demo").build();
        Plano plano = Plano.builder().id(20L).tipo(TipoPlano.MENSAL).build();
        Assinatura assinatura = Assinatura.builder().id(30L).aluno(aluno).plano(plano).build();

        return Pagamento.builder()
                .id(id)
                .assinatura(assinatura)
                .valor(new BigDecimal(valor))
                .status(status)
                .dataPagamento(dataPagamento)
                .dataVencimento(dataVencimento)
                .build();
    }
}

