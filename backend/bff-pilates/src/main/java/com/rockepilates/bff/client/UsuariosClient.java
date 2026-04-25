package com.rockepilates.bff.client;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UsuariosClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String USUARIOS_SERVICE_URL = "http://localhost:8081";

    public String getUsuariosHealth() {
        return restTemplate.getForObject(
                USUARIOS_SERVICE_URL + "/health",
                String.class
        );
    }

    public String listarUsuarios(String authorizationHeader) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authorizationHeader);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                USUARIOS_SERVICE_URL + "/usuarios",
                HttpMethod.GET,
                entity,
                String.class
        );

        return response.getBody();
    }
}