package com.rockepilates.bff.service;

import com.rockepilates.bff.client.AlunoClient;
import com.rockepilates.bff.security.JwtAlunoService;
import feign.FeignException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class AlunoService {

    private final AlunoClient client;
    private final UsuariosService usuariosService;
    private final JwtAlunoService jwtAlunoService;

    public AlunoService(
            AlunoClient client,
            UsuariosService usuariosService,
            JwtAlunoService jwtAlunoService
    ) {
        this.client = client;
        this.usuariosService = usuariosService;
        this.jwtAlunoService = jwtAlunoService;
    }

    public void cadastrar(Map<String, Object> body) {
        try {
            client.cadastrar(body);
        } catch (FeignException.BadRequest ex) {
            throw new IllegalArgumentException(extractMessage(ex));
        }
    }

    public Map<String, Object> login(Map<String, Object> body) {
        try {
            return client.login(body);
        } catch (FeignException.BadRequest ex) {
            throw new IllegalArgumentException(extractMessage(ex));
        }
    }

    public Map<String, Object> buscarPerfilAluno(HttpServletRequest request) {
        Long alunoId = extrairAlunoId(request);

        return client.buscarPerfil(alunoId);
    }

    public List<Map<String, Object>> listarPagamentosAlunoLogado(
            HttpServletRequest request
    ) {
        Long alunoId = extrairAlunoId(request);

        return client.listarPagamentosPorAluno(alunoId);
    }

    public void atualizarAdmin(
            Long alunoId,
            Map<String, Object> body,
            HttpServletRequest request
    ) {
        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        client.atualizarAdmin(alunoId, body);
    }

    public void cancelarAssinatura(
            Long id,
            HttpServletRequest request
    ) {
        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        client.cancelarAssinatura(id);
    }

    public void cadastrarAdmin(
            Map<String, Object> body,
            HttpServletRequest request
    ) {
        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        try {
            client.cadastrarAdmin(body);
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

    public List<Map<String, Object>> listarPagamentosPorAssinatura(
            Long id,
            HttpServletRequest request
    ) {
        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        return client.listarPagamentosPorAssinatura(id);
    }

    public void atualizarPagamentosAtrasados(HttpServletRequest request) {
        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        client.atualizarPagamentosAtrasados();
    }

    public void atualizarObservacoesInternas(
            Long alunoId,
            Map<String, Object> body,
            HttpServletRequest request
    ) {
        String authorization = extrairAuthorization(request);

        usuariosService.validarAdmin(authorization);

        client.atualizarObservacoesInternas(alunoId, body);
    }

    private Long extrairAlunoId(HttpServletRequest request) {

        if (request.getCookies() == null) {
            throw new RuntimeException("Aluno não autenticado");
        }

        String token = Arrays.stream(request.getCookies())
                .filter(cookie -> "aluno_token".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(() ->
                        new RuntimeException("Aluno não autenticado")
                );

        boolean tokenValido = jwtAlunoService.isTokenValid(token);

        if (!tokenValido) {
            throw new RuntimeException("Sessão do aluno inválida");
        }

        Long alunoId = jwtAlunoService.extractAlunoId(token);

        if (alunoId == null) {
            throw new RuntimeException("Sessão do aluno inválida");
        }

        return alunoId;
    }

    private String extrairAuthorization(HttpServletRequest request) {

        if (request.getCookies() == null) {
            throw new RuntimeException("Token não encontrado");
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> "admin_token".equals(cookie.getName()))
                .findFirst()
                .map(cookie -> "Bearer " + cookie.getValue())
                .orElseThrow(() ->
                        new RuntimeException("Token não encontrado")
                );
    }

    private String extractMessage(FeignException ex) {

        String body = ex.contentUTF8();

        if (body == null || body.isBlank()) {
            return "Erro ao processar solicitação";
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