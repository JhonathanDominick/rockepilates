package com.rockepilates.bff.client;

import com.rockepilates.bff.config.FeignConfig;
import com.rockepilates.bff.dto.CreateUsuarioRequest;
import com.rockepilates.bff.dto.LoginRequest;
import com.rockepilates.bff.dto.LoginResponse;
import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.SuccessResponse;
import com.rockepilates.bff.dto.UsuarioResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "usuarios-service",
        url = "http://localhost:8081",
        fallback = UsuariosClientFallback.class,
        configuration = FeignConfig.class
)
public interface UsuariosClient {

    @GetMapping("/usuarios")
    PagedResponse<UsuarioResponse> listarUsuarios(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam int page,
            @RequestParam int size
    );

    @GetMapping("/usuarios/{id}")
    SuccessResponse<UsuarioResponse> buscarUsuarioPorId(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long id
    );

    @PostMapping("/usuarios")
    SuccessResponse<UsuarioResponse> criarUsuario(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CreateUsuarioRequest request
    );

    @PostMapping("/usuarios/login")
    LoginResponse login(
            @RequestBody LoginRequest request
    );
}