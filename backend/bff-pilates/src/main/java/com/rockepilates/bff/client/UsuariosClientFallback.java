package com.rockepilates.bff.client;

import com.rockepilates.bff.dto.CreateUsuarioRequest;
import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.SuccessResponse;
import com.rockepilates.bff.dto.UsuarioResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class UsuariosClientFallback implements UsuariosClient {

    private static final Logger log = LoggerFactory.getLogger(UsuariosClientFallback.class);

    @Override
    public SuccessResponse<UsuarioResponse> buscarUsuarioPorId(
            String authorizationHeader,
            Long id
    ) {
        log.error("Fallback acionado para buscar usuario por id={}", id);

        return null;
    }

    @Override
    public PagedResponse<UsuarioResponse> listarUsuarios(
            String authorizationHeader,
            int page,
            int size
    ) {
        log.error("Fallback acionado para usuarios-service. page={}, size={}", page, size);

        return new PagedResponse<>(
                Collections.emptyList(),
                page,
                size,
                0,
                0
        );
    }

    @Override
    public SuccessResponse<UsuarioResponse> criarUsuario(
            String authorizationHeader,
            CreateUsuarioRequest request
    ) {
        log.error("Fallback acionado para criação de usuário. email={}", request.email());

        throw new RuntimeException("Erro ao criar usuário no usuarios-service");
    }
}