package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.dto.DashboardFinanceiroResponse;
import com.rockepilates.gerenciador.dto.FaturamentoMensalResponse;
import com.rockepilates.gerenciador.dto.PagamentoResumoResponse;
import com.rockepilates.gerenciador.entity.Pagamento;
import com.rockepilates.gerenciador.enums.StatusAssinatura;
import com.rockepilates.gerenciador.enums.StatusPagamento;
import com.rockepilates.gerenciador.repository.AssinaturaRepository;
import com.rockepilates.gerenciador.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class DashboardFinanceiroService {

    private final AssinaturaRepository assinaturaRepository;
    private final PagamentoRepository pagamentoRepository;

    public DashboardFinanceiroResponse buscarDashboard() {

        long totalAlunosAtivos =
                assinaturaRepository.countByStatus(StatusAssinatura.ATIVA);

        long pagamentosPendentes =
                pagamentoRepository.countByStatus(StatusPagamento.PENDENTE);

        long pagamentosAtrasados =
                pagamentoRepository.countByStatus(StatusPagamento.ATRASADO);

        LocalDate inicioMes = LocalDate.now().withDayOfMonth(1);
        LocalDate fimMes = inicioMes.plusMonths(1).minusDays(1);

        List<Pagamento> pagamentosRecebidos =
                pagamentoRepository.findByStatusAndDataPagamentoBetween(
                        StatusPagamento.PAGO,
                        inicioMes,
                        fimMes
                );

        BigDecimal faturamentoRecebidoMes =
                somarPagamentos(pagamentosRecebidos);

        List<Pagamento> pagamentosEmAberto =
                pagamentoRepository.findByStatusIn(
                        List.of(
                                StatusPagamento.PENDENTE,
                                StatusPagamento.ATRASADO
                        )
                );

        BigDecimal faturamentoPrevistoAberto =
                somarPagamentos(pagamentosEmAberto);

        List<PagamentoResumoResponse> ultimosPagamentos =
                pagamentoRepository.findTop5ByOrderByCriadoEmDesc()
                        .stream()
                        .map(pagamento -> new PagamentoResumoResponse(
                                pagamento.getId(),
                                pagamento.getAssinatura().getAluno().getNome(),
                                pagamento.getValor(),
                                pagamento.getStatus().name(),
                                pagamento.getDataPagamento(),
                                pagamento.getDataVencimento()
                        ))
                        .toList();

        List<FaturamentoMensalResponse> faturamentoMensal =
                gerarFaturamentoMensal();

        return new DashboardFinanceiroResponse(
                totalAlunosAtivos,
                pagamentosPendentes,
                pagamentosAtrasados,
                faturamentoRecebidoMes,
                faturamentoPrevistoAberto,
                ultimosPagamentos,
                faturamentoMensal
        );
    }

    private List<FaturamentoMensalResponse> gerarFaturamentoMensal() {
        LocalDate mesAtual = LocalDate.now().withDayOfMonth(1);

        return IntStream.rangeClosed(0, 5)
                .mapToObj(indice -> mesAtual.minusMonths(5L - indice))
                .map(mes -> {
                    LocalDate inicio = mes.withDayOfMonth(1);
                    LocalDate fim = inicio.plusMonths(1).minusDays(1);

                    List<Pagamento> pagamentos =
                            pagamentoRepository.findByStatusAndDataPagamentoBetween(
                                    StatusPagamento.PAGO,
                                    inicio,
                                    fim
                            );

                    String nomeMes = mes.getMonth()
                            .getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"))
                            .replace(".", "");

                    return new FaturamentoMensalResponse(
                            nomeMes,
                            somarPagamentos(pagamentos)
                    );
                })
                .toList();
    }

    private BigDecimal somarPagamentos(List<Pagamento> pagamentos) {
        return pagamentos.stream()
                .map(Pagamento::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}