package com.rockepilates.bff.client;

import com.rockepilates.bff.dto.MediaUploadResponse;
import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import com.rockepilates.bff.dto.SuccessResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public class GerenciadorClientFallback implements GerenciadorClient {

    private static final Logger log = LoggerFactory.getLogger(GerenciadorClientFallback.class);

    @Override
    public SuccessResponse<SiteConfigResponse> salvar(SiteConfigRequest request) {
        throw serviceUnavailable("salvamento de configuração do site");
    }

    @Override
    public SuccessResponse<SiteConfigResponse> buscar(String chave) {
        throw serviceUnavailable("busca de configuração do site chave=" + chave);
    }

    @Override
    public SuccessResponse<List<SiteConfigResponse>> listar() {
        throw serviceUnavailable("listagem de configurações do site");
    }

    @Override
    public MediaUploadResponse uploadMedia(MultipartFile file) {
        throw serviceUnavailable("upload de mídia");
    }

    private IllegalStateException serviceUnavailable(String operation) {
        log.error("Fallback acionado para {}", operation);
        return new IllegalStateException("gerenciador-service indisponível");
    }
}
