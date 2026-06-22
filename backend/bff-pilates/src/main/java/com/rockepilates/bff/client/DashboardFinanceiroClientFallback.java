package com.rockepilates.bff.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class DashboardFinanceiroClientFallback implements DashboardFinanceiroClient {

    private static final Logger log = LoggerFactory.getLogger(DashboardFinanceiroClientFallback.class);

    @Override
    public Map<String, Object> buscarDashboard() {
        log.error("Fallback acionado para dashboard financeiro");
        throw new IllegalStateException("gerenciador-service indisponível");
    }
}
