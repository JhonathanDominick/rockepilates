package com.rockepilates.bff.service;

import com.rockepilates.bff.client.UsuariosClient;
import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.UsuarioResponse;
import org.springframework.stereotype.Service;

@Service
public class UsuariosService {

    private final UsuariosClient client;

    public UsuariosService(UsuariosClient client) {
        this.client = client;
    }

    public String buscarHealthUsuarios() {
        return client.getUsuariosHealth();
    }

    public PagedResponse<UsuarioResponse> listarUsuarios(
            String authorizationHeader,
            int page,
            int size
    ) {
        return client.listarUsuarios(authorizationHeader, page, size);
    }
}