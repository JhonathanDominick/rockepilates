package com.rockepilates.bff.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class DepoimentoClientFallback implements DepoimentoClient {

    private static final Logger log = LoggerFactory.getLogger(DepoimentoClientFallback.class);

    @Override
    public Map<String, Object> criar(Map<String, String> body) {
        throw serviceUnavailable("criação de depoimento");
    }

    @Override
    public List<Map<String, Object>> listar() {
        log.error("Fallback acionado para listagem pública de depoimentos");
        return Collections.emptyList();
    }

    @Override
    public List<Map<String, Object>> listarAdmin() {
        throw serviceUnavailable("listagem administrativa de depoimentos");
    }

    @Override
    public Map<String, Object> aprovar(Long id) {
        throw serviceUnavailable("aprovação de depoimento id=" + id);
    }

    @Override
    public Map<String, Object> desaprovar(Long id) {
        throw serviceUnavailable("desaprovação de depoimento id=" + id);
    }

    private IllegalStateException serviceUnavailable(String operation) {
        log.error("Fallback acionado para {}", operation);
        return new IllegalStateException("gerenciador-service indisponível");
    }
}
