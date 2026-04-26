package com.rockepilates.bff.client;

import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.UsuarioResponse;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.rockepilates.bff.exception.UsuariosServiceIntegrationException;
import org.springframework.web.client.RestClientException;

@Component
public class UsuariosClient {

    private final RestTemplate restTemplate;

    private static final String USUARIOS_SERVICE_URL = "http://localhost:8081";

    public String getUsuariosHealth() {
        return restTemplate.getForObject(
                USUARIOS_SERVICE_URL + "/health",
                String.class
        );
    }

    public UsuariosClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    public PagedResponse<UsuarioResponse> listarUsuarios(
            String authorizationHeader,
            int page,
            int size
    ) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authorizationHeader);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            String url = USUARIOS_SERVICE_URL + "/usuarios?page=" + page + "&size=" + size;

            ResponseEntity<PagedResponse<UsuarioResponse>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            return response.getBody();

        } catch (RestClientException ex) {
            throw new UsuariosServiceIntegrationException(
                    "Erro ao comunicar com usuarios-service"
            );
        }
    }
}