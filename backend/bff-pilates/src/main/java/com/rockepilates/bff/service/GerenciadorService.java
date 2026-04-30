package com.rockepilates.bff.service;

import com.rockepilates.bff.client.GerenciadorClient;
import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import com.rockepilates.bff.exception.FeignErrorHandler;
import feign.FeignException;
import org.springframework.stereotype.Service;

@Service
public class GerenciadorService {

    private final GerenciadorClient client;
    private final UsuariosService usuariosService;

    public GerenciadorService(GerenciadorClient client, UsuariosService usuariosService) {
        this.client = client;
        this.usuariosService = usuariosService;
    }

    public SiteConfigResponse salvar(String authorizationHeader, SiteConfigRequest request) {
        usuariosService.validarAdmin(authorizationHeader);

        try {
            return client.salvar(request).data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public SiteConfigResponse buscar(String chave) {
        try {
            return client.buscar(chave).data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }
}