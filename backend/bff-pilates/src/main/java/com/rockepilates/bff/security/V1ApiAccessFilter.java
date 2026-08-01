package com.rockepilates.bff.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
public class V1ApiAccessFilter extends OncePerRequestFilter {

    private static final Set<String> ALLOWED_EXACT_PATHS = Set.of(
            "/bff/health",
            "/bff/usuarios/login",
            "/bff/usuarios/logout",
            "/bff/media/upload"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (!isV1Mode() || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        if (!path.startsWith("/bff/")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (isAllowedPath(path, request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        response.sendError(HttpServletResponse.SC_NOT_FOUND);
    }

    private boolean isV1Mode() {
        return "v1".equalsIgnoreCase(System.getenv().getOrDefault("APP_MODE", "v1"));
    }

    private boolean isAllowedPath(String path, String method) {
        if (ALLOWED_EXACT_PATHS.contains(path) || path.startsWith("/bff/configs")) {
            return true;
        }

        if (("GET".equalsIgnoreCase(method) || "POST".equalsIgnoreCase(method)) && "/bff/depoimentos".equals(path)) {
            return true;
        }

        if ("GET".equalsIgnoreCase(method) && "/bff/depoimentos/admin".equals(path)) {
            return true;
        }

        return "PATCH".equalsIgnoreCase(method) &&
                path.matches("^/bff/depoimentos/\\d+/(aprovar|desaprovar)$");
    }
}