package com.rockepilates.bff.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class FinanceiroClientFallback implements FinanceiroClient {

    private static final Logger log = LoggerFactory.getLogger(FinanceiroClientFallback.class);

    @Override
    public Map<String, Object> listarPagamentos() {
        log.error("Fallback acionado para listagem financeira de pagamentos");
        throw new IllegalStateException("gerenciador-service indisponível");
    }
}
