package com.rockepilates.bff.service;

import com.rockepilates.bff.client.UsuariosClient;
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

    public String listarUsuarios(String authorizationHeader) {
        return client.listarUsuarios(authorizationHeader);
    }
}