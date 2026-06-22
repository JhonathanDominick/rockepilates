package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.dto.FinanceiroAdminResponse;
import com.rockepilates.gerenciador.dto.FinanceiroResumoResponse;
import com.rockepilates.gerenciador.dto.PagamentoAdminResponse;
import com.rockepilates.gerenciador.entity.Pagamento;
import com.rockepilates.gerenciador.enums.StatusPagamento;
import com.rockepilates.gerenciador.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceiroService {

    private final PagamentoRepository pagamentoRepository;

    public FinanceiroAdminResponse listarPagamentos() {

        List<Pagamento> pagamentos =
                pagamentoRepository.findAllByOrderByDataVencimentoDesc();

        LocalDate inicioMes = LocalDate.now().withDayOfMonth(1);
        LocalDate fimMes = inicioMes.plusMonths(1).minusDays(1);

        BigDecimal recebidoMes =
                pagamentos.stream()
                        .filter(pagamento ->
                                pagamento.getStatus() == StatusPagamento.PAGO
                                        && pagamento.getDataPagamento() != null
                                        && !pagamento.getDataPagamento().isBefore(inicioMes)
                                        && !pagamento.getDataPagamento().isAfter(fimMes)
                        )
                        .map(Pagamento::getValor)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendenteMes =
                pagamentos.stream()
                        .filter(pagamento ->
                                pagamento.getStatus() == StatusPagamento.PENDENTE
                                        && vencimentoNoMesAtual(pagamento, inicioMes, fimMes)
                        )
                        .map(Pagamento::getValor)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal atrasadoMes =
                pagamentos.stream()
                        .filter(pagamento ->
                                pagamento.getStatus() == StatusPagamento.ATRASADO
                        )
                        .map(Pagamento::getValor)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<PagamentoAdminResponse> response =
                pagamentos.stream()
                        .map(pagamento -> new PagamentoAdminResponse(
                                pagamento.getId(),
                                pagamento.getAssinatura().getId(),
                                pagamento.getAssinatura().getAluno().getNome(),
                                pagamento.getAssinatura().getPlano().getTipo().name(),
                                pagamento.getValor(),
                                pagamento.getStatus().name(),
                                pagamento.getDataPagamento(),
                                pagamento.getDataVencimento()
                        ))
                        .toList();

        return new FinanceiroAdminResponse(
                new FinanceiroResumoResponse(
                        recebidoMes,
                        pendenteMes,
                        atrasadoMes
                ),
                response
        );
    }

    private boolean vencimentoNoMesAtual(
            Pagamento pagamento,
            LocalDate inicioMes,
            LocalDate fimMes
    ) {
        return pagamento.getDataVencimento() != null
                && !pagamento.getDataVencimento().isBefore(inicioMes)
                && !pagamento.getDataVencimento().isAfter(fimMes);
    }
}