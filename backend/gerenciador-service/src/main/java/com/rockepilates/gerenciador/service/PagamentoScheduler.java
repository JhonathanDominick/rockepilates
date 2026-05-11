package com.rockepilates.gerenciador.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PagamentoScheduler {

    private final AlunoService alunoService;

    @Scheduled(cron = "0 0 3 * * *")
    public void atualizarPagamentosAtrasadosAutomaticamente() {
        alunoService.atualizarPagamentosAtrasados();
    }
}