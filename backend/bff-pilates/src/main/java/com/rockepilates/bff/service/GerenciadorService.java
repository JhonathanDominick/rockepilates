package com.rockepilates.bff.service;

import com.rockepilates.bff.client.GerenciadorClient;
import com.rockepilates.bff.dto.MediaUploadResponse;
import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import com.rockepilates.bff.exception.FeignErrorHandler;
import feign.FeignException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
public class GerenciadorService {

    private static final Set<String> PUBLIC_EXTERNAL_CONFIG_KEYS = Set.of(
            "external.seufisio.agendaUrl",
            "external.seufisio.appAndroidUrl",
            "external.seufisio.appIosUrl",
            "external.rockeracademy.url",
            "external.maps.reviewsUrl",
            "external.whatsappUrl"
    );

    private final GerenciadorClient client;
    private final UsuariosService usuariosService;

    public GerenciadorService(GerenciadorClient client, UsuariosService usuariosService) {
        this.client = client;
        this.usuariosService = usuariosService;
    }

    private String extrairAuthorization(HttpServletRequest request) {

        if (request.getCookies() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token nao encontrado");
        }

        for (Cookie cookie : request.getCookies()) {
            if ("admin_token".equals(cookie.getName())) {
                return "Bearer " + cookie.getValue();
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token nao encontrado");
    }

    public SiteConfigResponse salvar(HttpServletRequest request, SiteConfigRequest requestBody) {

        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        try {
            return client.salvar(requestBody).data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public SiteConfigResponse buscar(String chave) {
        if (!isPublicConfigKey(chave)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Configuracao nao encontrada");
        }

        try {
            return client.buscar(chave).data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public List<SiteConfigResponse> listarPublicas() {
        try {
            return client.listar().data().stream()
                    .filter(config -> isPublicConfigKey(config.chave()))
                    .toList();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public List<SiteConfigResponse> listar(HttpServletRequest request) {
        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        try {
            return client.listar().data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public MediaUploadResponse uploadMedia(HttpServletRequest request, MultipartFile file) {

        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        try {
            return client.uploadMedia(file);
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    public SiteConfigResponse salvarSemValidacaoAdmin(SiteConfigRequest request) {
        try {
            return client.salvar(request).data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    private boolean isPublicConfigKey(String chave) {
        return chave != null &&
                (chave.startsWith("home.") || PUBLIC_EXTERNAL_CONFIG_KEYS.contains(chave));
    }
}