package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.entity.SiteConfig;
import com.rockepilates.gerenciador.repository.SiteConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SiteConfigService {

    private final SiteConfigRepository repository;

    public SiteConfig salvar(String chave, String valor) {
        return repository.findByChave(chave)
                .map(config -> {
                    config.setValor(valor);
                    return repository.save(config);
                })
                .orElseGet(() -> repository.save(
                        SiteConfig.builder()
                                .chave(chave)
                                .valor(valor)
                                .build()
                ));
    }

    public SiteConfig buscarPorChave(String chave) {
        return repository.findByChave(chave)
                .orElseThrow(() -> new RuntimeException("Config não encontrada"));
    }
}