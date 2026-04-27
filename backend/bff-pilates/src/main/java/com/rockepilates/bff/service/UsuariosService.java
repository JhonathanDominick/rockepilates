package com.rockepilates.bff.service;

import com.rockepilates.bff.client.UsuariosClient;
import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.UsuarioResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UsuariosService {

    private static final Logger log = LoggerFactory.getLogger(UsuariosService.class);

    private final UsuariosClient client;

    public UsuariosService(UsuariosClient client) {
        this.client = client;
    }

    public PagedResponse<UsuarioResponse> listarUsuarios(
            String authorizationHeader,
            int page,
            int size
    ) {
        long inicio = System.currentTimeMillis();

        log.info("Iniciando chamada ao usuarios-service para listar usuários. page={}, size={}", page, size);

        PagedResponse<UsuarioResponse> response = client.listarUsuarios(authorizationHeader, page, size);

        long duracao = System.currentTimeMillis() - inicio;

        log.info(
                "Chamada ao usuarios-service finalizada com sucesso. page={}, size={}, totalElements={}, duracaoMs={}",
                page,
                size,
                response.totalElements(),
                duracao
        );

        return response;
    }
}