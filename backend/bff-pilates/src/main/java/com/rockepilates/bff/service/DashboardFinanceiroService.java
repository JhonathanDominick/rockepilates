package com.rockepilates.bff.service;

import com.rockepilates.bff.client.DashboardFinanceiroClient;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Map;

@Service
public class DashboardFinanceiroService {

    private final DashboardFinanceiroClient client;
    private final UsuariosService usuariosService;

    public DashboardFinanceiroService(
            DashboardFinanceiroClient client,
            UsuariosService usuariosService
    ) {
        this.client = client;
        this.usuariosService = usuariosService;
    }

    public Map<String, Object> buscarDashboard(HttpServletRequest request) {
        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        return client.buscarDashboard();
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