package com.rockepilates.bff.service;

import com.rockepilates.bff.client.GerenciadorClient;
import com.rockepilates.bff.dto.MediaUploadResponse;
import com.rockepilates.bff.dto.SiteConfigRequest;
import com.rockepilates.bff.dto.SiteConfigResponse;
import com.rockepilates.bff.exception.FeignErrorHandler;
import feign.FeignException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class GerenciadorService {

    private final GerenciadorClient client;
    private final UsuariosService usuariosService;

    public GerenciadorService(GerenciadorClient client, UsuariosService usuariosService) {
        this.client = client;
        this.usuariosService = usuariosService;
    }

    // =========================
    // 🔐 MÉTODO CENTRAL (TOKEN)
    // =========================
    private String extrairAuthorization(HttpServletRequest request) {

        if (request.getCookies() == null) {
            throw new RuntimeException("Token não encontrado");
        }

        for (Cookie cookie : request.getCookies()) {
            if ("admin_token".equals(cookie.getName())) {
                return "Bearer " + cookie.getValue();
            }
        }

        throw new RuntimeException("Token não encontrado");
    }

    // =========================
    // 💾 SALVAR CONFIG
    // =========================
    public SiteConfigResponse salvar(HttpServletRequest request, SiteConfigRequest requestBody) {

        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        try {
            return client.salvar(requestBody).data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    // =========================
    // 🔍 BUSCAR
    // =========================
    public SiteConfigResponse buscar(String chave) {
        try {
            return client.buscar(chave).data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    // =========================
    // 📄 LISTAR
    // =========================
    public List<SiteConfigResponse> listar() {
        try {
            return client.listar().data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    // =========================
    // 📤 UPLOAD DE MÍDIA
    // =========================
    public MediaUploadResponse uploadMedia(HttpServletRequest request, MultipartFile file) {

        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        try {
            return client.uploadMedia(file);
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }

    // =========================
    // ⚠️ SEM VALIDAÇÃO (cuidado)
    // =========================
    public SiteConfigResponse salvarSemValidacaoAdmin(SiteConfigRequest request) {
        try {
            return client.salvar(request).data();
        } catch (FeignException ex) {
            throw FeignErrorHandler.handle(ex);
        }
    }
}