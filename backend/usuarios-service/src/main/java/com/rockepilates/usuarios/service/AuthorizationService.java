package com.rockepilates.usuarios.service;

import com.rockepilates.usuarios.security.AuthenticatedUser;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    public void validateSelfOrAdmin(Long targetUserId, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new AccessDeniedException("Acesso negado");
        }

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return;
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof AuthenticatedUser authenticatedUser)) {
            throw new AccessDeniedException("Acesso negado");
        }

        if (!authenticatedUser.id().equals(targetUserId)) {
            throw new AccessDeniedException("Você não tem permissão para acessar este recurso");
        }
    }
}