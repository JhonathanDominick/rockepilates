package com.rockepilates.bff.client;

import com.rockepilates.bff.dto.MediaUploadResponse;
import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import com.rockepilates.bff.dto.SuccessResponse;
import com.rockepilates.bff.exception.FeignErrorHandler;
import feign.FeignException;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public class GerenciadorClientFallback implements FallbackFactory<GerenciadorClient> {

    private static final Logger log = LoggerFactory.getLogger(GerenciadorClientFallback.class);

    @Override
    public GerenciadorClient create(Throwable cause) {
        return new GerenciadorClient() {
            @Override
            public SuccessResponse<SiteConfigResponse> salvar(SiteConfigRequest request) {
                throw fallback("salvamento de configuração do site", cause);
            }

            @Override
            public SuccessResponse<SiteConfigResponse> buscar(String chave) {
                throw fallback("busca de configuração do site chave=" + chave, cause);
            }

            @Override
            public SuccessResponse<List<SiteConfigResponse>> listar() {
                throw fallback("listagem de configurações do site", cause);
            }

            @Override
            public MediaUploadResponse uploadMedia(MultipartFile file) {
                throw fallback("upload de mídia", cause);
            }
        };
    }

    private RuntimeException fallback(String operation, Throwable cause) {
        if (cause instanceof FeignException feignException) {
            log.warn("Fallback acionado para {} após resposta HTTP do gerenciador-service status={}",
                    operation,
                    feignException.status());
            return FeignErrorHandler.handle(feignException);
        }

        log.error("Fallback acionado para {}", operation, cause);
        return new IllegalStateException("gerenciador-service indisponível");
    }
}
