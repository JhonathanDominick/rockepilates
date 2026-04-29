package com.rockepilates.bff.client;

import com.rockepilates.bff.dto.SuccessResponse;
import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "gerenciador-service",
        url = "http://localhost:8082"
)
public interface GerenciadorClient {

    @PostMapping("/configs")
    SuccessResponse<SiteConfigResponse> salvar(
            @RequestBody SiteConfigRequest request
    );

    @GetMapping("/configs/{chave}")
    SuccessResponse<SiteConfigResponse> buscar(
            @PathVariable String chave
    );
}