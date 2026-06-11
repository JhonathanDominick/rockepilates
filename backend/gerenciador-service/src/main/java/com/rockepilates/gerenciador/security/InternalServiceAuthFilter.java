package com.rockepilates.gerenciador.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class InternalServiceAuthFilter extends OncePerRequestFilter {

    private static final String HEADER_NAME = "X-Internal-Service-Token";

    @Value("${internal.service.token}")
    private String internalServiceToken;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String token = request.getHeader(HEADER_NAME);

        if (internalServiceToken == null ||
                internalServiceToken.isBlank() ||
                !internalServiceToken.equals(token)) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Token interno ausente ou invalido"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
