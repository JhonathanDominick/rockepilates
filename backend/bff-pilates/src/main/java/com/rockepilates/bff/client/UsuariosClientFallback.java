package com.rockepilates.bff.client;

import com.rockepilates.bff.dto.*;
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
        throw new IllegalStateException("usuarios-service indisponível");
    }

    @Override
    public PagedResponse<UsuarioResponse> listarUsuarios(
            String authorizationHeader,
            int page,
            int size
    ) {
        log.error("Fallback acionado para listar usuários");

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
        log.error("Fallback acionado para criação de usuário");
        throw new IllegalStateException("usuarios-service indisponível");
    }

    @Override
    public void atualizarSenha(
            String authorizationHeader,
            Long id,
            UpdateSenhaRequest request
    ) {
        log.error("Fallback acionado para atualização de senha id={}", id);
        throw new IllegalStateException("usuarios-service indisponível");
    }

    @Override
    public SuccessResponse<LoginResponse> login(
            LoginRequest request
    ) {
        log.error("Fallback acionado para login email={}", request.email());
        throw new IllegalStateException("usuarios-service indisponível");
    }
}