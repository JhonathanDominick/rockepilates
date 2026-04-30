package com.rockepilates.bff.service;

import com.rockepilates.bff.client.UsuariosClient;
import com.rockepilates.bff.dto.*;
import com.rockepilates.bff.exception.FeignErrorHandler;
import feign.FeignException;
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

        try {
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
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public UsuarioResponse buscarUsuarioPorId(String authorizationHeader, Long id) {
        long inicio = System.currentTimeMillis();

        log.info("Buscando usuário por id={}", id);

        try {
            SuccessResponse<UsuarioResponse> response = client.buscarUsuarioPorId(authorizationHeader, id);

            long duracao = System.currentTimeMillis() - inicio;

            log.info("Busca finalizada id={}, duracaoMs={}", id, duracao);

            return response.data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public UsuarioResponse criarUsuario(
            String authorizationHeader,
            CreateUsuarioRequest request
    ) {
        log.info("Iniciando criação de usuário. email={}", request.email());

        try {
            var response = client.criarUsuario(authorizationHeader, request);

            log.info("Usuário criado com sucesso. id={}", response.data().id());

            return response.data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public void atualizarSenha(
            String authorizationHeader,
            Long id,
            UpdateSenhaRequest request
    ) {
        log.info("Iniciando atualização de senha. id={}", id);

        try {
            client.atualizarSenha(authorizationHeader, id, request);

            log.info("Senha atualizada com sucesso. id={}", id);
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public LoginResponse login(LoginRequest request) {
        log.info("Iniciando login de usuário. email={}", request.email());

        try {
            SuccessResponse<LoginResponse> response = client.login(request);

            log.info("Login realizado com sucesso. email={}", request.email());

            return response.data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }

    }

    public String verificarUsuariosService() {
        try {
            client.health();
            return "UP";
        } catch (Exception e) {
            log.error("usuarios-service DOWN", e);
            return "DOWN";
        }
    }

    public void validarAdmin(String authorizationHeader) {
        try {
            client.listarUsuarios(authorizationHeader, 0, 1);
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }
}