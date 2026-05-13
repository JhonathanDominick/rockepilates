package com.rockepilates.bff.service;

import com.rockepilates.bff.client.FinanceiroClient;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Map;

@Service
public class FinanceiroService {

    private final FinanceiroClient client;
    private final UsuariosService usuariosService;

    public FinanceiroService(
            FinanceiroClient client,
            UsuariosService usuariosService
    ) {
        this.client = client;
        this.usuariosService = usuariosService;
    }

    public Map<String, Object> listarPagamentos(
            HttpServletRequest request
    ) {
        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        return client.listarPagamentos();
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
}