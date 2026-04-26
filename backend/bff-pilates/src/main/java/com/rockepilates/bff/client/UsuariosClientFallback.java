package com.rockepilates.bff.client;

import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.UsuarioResponse;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class UsuariosClientFallback implements UsuariosClient {

    @Override
    public PagedResponse<UsuarioResponse> listarUsuarios(
            String authorizationHeader,
            int page,
            int size
    ) {
        return new PagedResponse<>(
                Collections.emptyList(),
                page,
                size,
                0,
                0
        );
    }
}