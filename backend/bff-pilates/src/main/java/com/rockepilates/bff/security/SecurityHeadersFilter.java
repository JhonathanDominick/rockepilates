package com.rockepilates.bff.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityHeadersFilter extends OncePerRequestFilter {

    private static final String HSTS_ENABLED_ENV = "APP_SECURITY_HSTS_ENABLED";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("Referrer-Policy", "no-referrer");
        response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
        response.setHeader(
                "Content-Security-Policy",
                "default-src 'self'; " +
                        "img-src 'self' data: https:; " +
                        "script-src 'self'; " +
                        "style-src 'self' 'unsafe-inline'; " +
                        "connect-src 'self'; " +
                        "frame-ancestors 'none';"
        );

        if (isHstsEnabled()) {
            response.setHeader(
                    "Strict-Transport-Security",
                    "max-age=31536000; includeSubDomains"
            );
        }

        filterChain.doFilter(request, response);
    }

    private boolean isHstsEnabled() {
        return "true".equalsIgnoreCase(
                System.getenv().getOrDefault(HSTS_ENABLED_ENV, "false")
        );
    }
}