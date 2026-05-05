package com.rockepilates.bff.service;

import com.rockepilates.bff.client.DepoimentoClient;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class DepoimentoService {

    private final DepoimentoClient client;
    private final UsuariosService usuariosService;

    public DepoimentoService(DepoimentoClient client, UsuariosService usuariosService) {
        this.client = client;
        this.usuariosService = usuariosService;
    }

    private String extrairAuthorization(HttpServletRequest request) {
        if (request.getCookies() == null) {
            throw new RuntimeException("Token não encontrado");
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> "admin_token".equals(cookie.getName()))
                .findFirst()
                .map(cookie -> "Bearer " + cookie.getValue())
                .orElseThrow(() -> new RuntimeException("Token não encontrado"));
    }

    public Map<String, Object> criar(Map<String, String> body) {
        return client.criar(body);
    }

    public List<Map<String, Object>> listar() {
        return client.listar();
    }

    public List<Map<String, Object>> listarAdmin(HttpServletRequest request) {
        String authorization = extrairAuthorization(request);
        usuariosService.validarAdmin(authorization);

        return client.listarAdmin();
    }

    public Map<String, Object> aprovar(HttpServletRequest request, Long id) {
        String authorization = extrairAuthorization(request);
        usuariosService.validarAdmin(authorization);

        return client.aprovar(id);
    }

    public Map<String, Object> desaprovar(HttpServletRequest request, Long id) {
        String authorization = extrairAuthorization(request);
        usuariosService.validarAdmin(authorization);

        return client.desaprovar(id);
    }
}