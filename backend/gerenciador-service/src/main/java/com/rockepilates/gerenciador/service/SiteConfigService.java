package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.dto.SiteConfigRequest;
import com.rockepilates.gerenciador.dto.SiteConfigResponse;
import com.rockepilates.gerenciador.entity.SiteConfig;
import com.rockepilates.gerenciador.exception.ResourceNotFoundException;
import com.rockepilates.gerenciador.repository.SiteConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteConfigService {

    private final SiteConfigRepository repository;

    public SiteConfigResponse salvar(SiteConfigRequest request) {

        SiteConfig config = repository.findByChave(request.chave())
                .map(existing -> {
                    existing.setValor(request.valor());
                    existing.setTipo(request.tipo());
                    return repository.save(existing);
                })
                .orElseGet(() -> repository.save(
                        SiteConfig.builder()
                                .chave(request.chave())
                                .valor(request.valor())
                                .tipo(request.tipo())
                                .build()
                ));

        return toResponse(config);
    }

    public SiteConfigResponse buscarPorChave(String chave) {
        SiteConfig config = repository.findByChave(chave)
                .orElseThrow(() -> new ResourceNotFoundException("Configuração não encontrada"));

        return toResponse(config);
    }

    public List<SiteConfigResponse> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private SiteConfigResponse toResponse(SiteConfig config) {
        return new SiteConfigResponse(
                config.getId(),
                config.getChave(),
                config.getValor(),
                config.getTipo()
        );
    }
}