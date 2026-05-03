package com.rockepilates.bff.client;

import com.rockepilates.bff.dto.MediaUploadResponse;
import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import com.rockepilates.bff.dto.SuccessResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import com.rockepilates.bff.config.FeignMultipartConfig;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(
        name = "gerenciador-service",
        url = "http://localhost:8082",
        configuration = FeignMultipartConfig.class
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

    @GetMapping("/configs")
    SuccessResponse<List<SiteConfigResponse>> listar();

    @PostMapping(value = "/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    MediaUploadResponse uploadMedia(
            @RequestPart("file") MultipartFile file
    );
}