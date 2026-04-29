package com.rockepilates.gerenciador.controller;

import com.rockepilates.gerenciador.dto.SiteConfigRequest;
import com.rockepilates.gerenciador.dto.SiteConfigResponse;
import com.rockepilates.gerenciador.dto.SuccessResponse;
import com.rockepilates.gerenciador.service.SiteConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/configs")
@RequiredArgsConstructor
public class SiteConfigController {

    private final SiteConfigService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SuccessResponse<SiteConfigResponse> salvar(@RequestBody @Valid SiteConfigRequest request) {
        SiteConfigResponse response = service.salvar(request.chave(), request.valor());

        return new SuccessResponse<>(
                LocalDateTime.now(),
                HttpStatus.CREATED.value(),
                "Configuração salva com sucesso",
                response
        );
    }

    @GetMapping("/{chave}")
    public SuccessResponse<SiteConfigResponse> buscar(@PathVariable String chave) {
        SiteConfigResponse response = service.buscarPorChave(chave);

        return new SuccessResponse<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Configuração encontrada com sucesso",
                response
        );
    }
}