package com.rockepilates.bff.service;

import com.rockepilates.bff.client.AlunoClient;
import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class AlunoService {

    private final AlunoClient client;
    private final UsuariosService usuariosService;

    public AlunoService(AlunoClient client, UsuariosService usuariosService) {
        this.client = client;
        this.usuariosService = usuariosService;
    }

    public void cadastrar(Map<String, Object> body) {
        try {
            client.cadastrar(body);
        } catch (FeignException.BadRequest ex) {
            throw new IllegalArgumentException(extractMessage(ex));
        }
    }

    public List<Map<String, Object>> listarAdmin(HttpServletRequest request) {
        String authorization = extrairAuthorization(request);
        usuariosService.validarAdmin(authorization);

        return client.listarAdmin();
    }

    public void marcarComoPago(Long id, HttpServletRequest request) {

        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        client.marcarComoPago(id);
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

    private String extractMessage(FeignException ex) {
        String body = ex.contentUTF8();

        if (body == null || body.isBlank()) {
            return "Erro ao cadastrar aluno";
        }

        try {
            int index = body.indexOf("\"message\":\"");
            if (index == -1) {
                return body;
            }

            int start = index + "\"message\":\"".length();
            int end = body.indexOf("\"", start);

            if (end == -1) {
                return body;
            }

            return body.substring(start, end);
        } catch (Exception e) {
            return body;
        }
    }

}