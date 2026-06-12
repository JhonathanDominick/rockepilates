package com.rockepilates.bff.security;

import com.rockepilates.bff.dto.AdminIdentity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtAdminService {

    @Value("${jwt.admin.secret}")
    private String secret;

    public AdminIdentity extractAdminIdentity(String authorizationHeader) {
        try {
            Claims claims = extractAllClaims(extractToken(authorizationHeader));
            Long userId = claimToLong(claims.get("userId"));
            String email = claims.getSubject();
            String role = claims.get("role", String.class);

            if (claims.getExpiration() == null
                    || !claims.getExpiration().after(new Date())
                    || userId == null
                    || email == null
                    || email.isBlank()
                    || !"ADMIN".equals(role)) {
                throw new IllegalArgumentException("Sessao administrativa invalida");
            }

            return new AdminIdentity(userId, email, role);
        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new IllegalArgumentException("Sessao administrativa invalida");
        }
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Sessao administrativa invalida");
        }

        String token = authorizationHeader.substring(7);
        if (token.isBlank()) {
            throw new IllegalArgumentException("Sessao administrativa invalida");
        }
        return token;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private Long claimToLong(Object value) {
        if (value instanceof Integer integerValue) {
            return integerValue.longValue();
        }
        if (value instanceof Long longValue) {
            return longValue;
        }
        if (value instanceof String stringValue) {
            return Long.parseLong(stringValue);
        }
        return null;
    }
}
