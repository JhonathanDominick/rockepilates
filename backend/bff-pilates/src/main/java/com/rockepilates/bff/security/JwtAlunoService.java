package com.rockepilates.bff.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtAlunoService {

    @Value("${jwt.aluno.secret}")
    private String secret;

    public Long extractAlunoId(String token) {
        Object alunoId = extractAllClaims(token).get("alunoId");

        return claimToLong(alunoId);
    }

    public Long extractSessionVersion(String token) {
        Object sessionVersion = extractAllClaims(token).get("sessionVersion");

        return claimToLong(sessionVersion);
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);

            Object tipo = claims.get("tipo");

            return claims.getExpiration().after(new Date())
                    && tipo != null
                    && "ALUNO".equals(tipo.toString());
        } catch (Exception ex) {
            return false;
        }
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
