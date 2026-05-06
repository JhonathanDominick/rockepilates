package com.rockepilates.bff.service;

import com.rockepilates.bff.client.DepoimentoClient;
import feign.FeignException;
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
        try {
            return client.criar(body);
        } catch (FeignException.BadRequest exception) {
            throw new IllegalArgumentException(extrairMensagemErro(exception));
        }
    }

    private String extrairMensagemErro(FeignException exception) {
        String content = exception.contentUTF8();

        if (content == null || content.isBlank()) {
            return "Dados inválidos";
        }

        if (content.contains("Mensagem inválida")) {
            return "Mensagem inválida";
        }

        if (content.contains("Nome é obrigatório")) {
            return "Nome é obrigatório";
        }

        if (content.contains("Mensagem é obrigatória")) {
            return "Mensagem é obrigatória";
        }

        if (content.contains("Nome deve ter entre")) {
            return "Nome deve ter entre 2 e 80 caracteres";
        }

        if (content.contains("Mensagem deve ter entre")) {
            return "Mensagem deve ter entre 10 e 500 caracteres";
        }

        return "Dados inválidos";
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