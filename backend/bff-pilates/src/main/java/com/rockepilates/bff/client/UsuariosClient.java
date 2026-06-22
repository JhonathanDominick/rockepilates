package com.rockepilates.bff.client;

import com.rockepilates.bff.config.FeignConfig;
import com.rockepilates.bff.dto.CreateUsuarioRequest;
import com.rockepilates.bff.dto.LoginRequest;
import com.rockepilates.bff.dto.LoginResponse;
import com.rockepilates.bff.dto.PagedResponse;
import com.rockepilates.bff.dto.SuccessResponse;
import com.rockepilates.bff.dto.UpdateSenhaRequest;
import com.rockepilates.bff.dto.UpdateUsuarioRequest;
import com.rockepilates.bff.dto.UsuarioResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "usuarios-service",
        url = "${usuarios.url}",
        configuration = FeignConfig.class,
        fallback = UsuariosClientFallback.class
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

    @PatchMapping("/usuarios/{id}/senha")
    void atualizarSenha(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long id,
            @RequestBody UpdateSenhaRequest request
    );

    @PostMapping("/usuarios/login")
    SuccessResponse<LoginResponse> login(
            @RequestBody LoginRequest request
    );

    @PutMapping("/usuarios/{id}")
    SuccessResponse<UsuarioResponse> atualizarUsuario(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long id,
            @RequestBody UpdateUsuarioRequest request
    );

    @GetMapping("/actuator/health")
    Object health();
}
