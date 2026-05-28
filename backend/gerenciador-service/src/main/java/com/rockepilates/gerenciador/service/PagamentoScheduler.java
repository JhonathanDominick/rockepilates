package com.rockepilates.gerenciador.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PagamentoScheduler {

    private final AlunoService alunoService;

    @Scheduled(cron = "0 0 3 * * *")
    public void atualizarPagamentosAtrasadosAutomaticamente() {
        log.info("Iniciando atualização automática de pagamentos atrasados");

        try {
            alunoService.atualizarPagamentosAtrasados();

            log.info("Atualização automática de pagamentos atrasados concluída com sucesso");
        } catch (Exception exception) {
            log.error(
                    "Erro ao executar atualização automática de pagamentos atrasados",
                    exception
            );

            throw exception;
        }
    }
}