package com.rockepilates.bff.service;

import com.rockepilates.bff.client.GerenciadorClient;
import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import org.springframework.stereotype.Service;

@Service
public class GerenciadorService {

    private final GerenciadorClient client;

    public GerenciadorService(GerenciadorClient client) {
        this.client = client;
    }

    public SiteConfigResponse salvar(SiteConfigRequest request) {
        return client.salvar(request).data();
    }

    public SiteConfigResponse buscar(String chave) {
        return client.buscar(chave).data();
    }
}