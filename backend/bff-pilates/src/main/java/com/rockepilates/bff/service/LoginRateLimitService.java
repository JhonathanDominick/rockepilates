package com.rockepilates.bff.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginRateLimitService {

    private static final int MAX_TENTATIVAS_POR_MINUTO = 5;

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public boolean permitirTentativa(String tipoLogin, HttpServletRequest request) {
        String chave = tipoLogin + ":" + resolverIpCliente(request);

        Bucket bucket = buckets.computeIfAbsent(chave, key -> criarBucket());

        return bucket.tryConsume(1);
    }

    private Bucket criarBucket() {
        Bandwidth limite = Bandwidth.classic(
                MAX_TENTATIVAS_POR_MINUTO,
                Refill.intervally(
                        MAX_TENTATIVAS_POR_MINUTO,
                        Duration.ofMinutes(1)
                )
        );

        return Bucket.builder()
                .addLimit(limite)
                .build();
    }

    private String resolverIpCliente(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        String realIp = request.getHeader("X-Real-IP");

        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }

        return request.getRemoteAddr();
    }
}