package com.rockepilates.bff.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UsuariosClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getUsuariosHealth() {
        return restTemplate.getForObject(
                "http://localhost:8081/health",
                String.class
        );
    }
}