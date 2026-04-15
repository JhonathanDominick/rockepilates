package com.rockepilates.usuarios.controller;

import com.rockepilates.usuarios.dto.CreateUsuarioRequest;
import com.rockepilates.usuarios.dto.LoginRequest;
import com.rockepilates.usuarios.dto.LoginResponse;
import com.rockepilates.usuarios.dto.PagedResponse;
import com.rockepilates.usuarios.dto.SuccessResponse;
import com.rockepilates.usuarios.dto.UpdateSenhaRequest;
import com.rockepilates.usuarios.dto.UpdateUsuarioRequest;
import com.rockepilates.usuarios.dto.UsuarioResponse;
import com.rockepilates.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<SuccessResponse<UsuarioResponse>> criarUsuario(
            @RequestBody @Valid CreateUsuarioRequest request
    ) {
        UsuarioResponse response = usuarioService.criarUsuario(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        HttpStatus.CREATED.value(),
                        "Usuário criado com sucesso",
                        response
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse<UsuarioResponse>> buscarPorId(
            @PathVariable Long id,
            Authentication authentication
    ) {
        UsuarioResponse response = usuarioService.buscarPorId(id, authentication);

        return ResponseEntity.ok(
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        HttpStatus.OK.value(),
                        "Usuário encontrado com sucesso",
                        response
                )
        );
    }

    @GetMapping
    public ResponseEntity<PagedResponse<UsuarioResponse>> listarUsuarios(Pageable pageable) {
        return ResponseEntity.ok(usuarioService.listarUsuarios(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuccessResponse<UsuarioResponse>> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUsuarioRequest request,
            Authentication authentication
    ) {
        UsuarioResponse response = usuarioService.atualizarUsuario(id, request, authentication);

        return ResponseEntity.ok(
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        HttpStatus.OK.value(),
                        "Usuário atualizado com sucesso",
                        response
                )
        );
    }

    @PatchMapping("/{id}/senha")
    public ResponseEntity<SuccessResponse<Void>> alterarSenha(
            @PathVariable Long id,
            @RequestBody @Valid UpdateSenhaRequest request,
            Authentication authentication
    ) {
        usuarioService.alterarSenha(id, request, authentication);

        return ResponseEntity.ok(
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        HttpStatus.OK.value(),
                        "Senha alterada com sucesso",
                        null
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<SuccessResponse<LoginResponse>> login(
            @RequestBody @Valid LoginRequest request
    ) {
        String token = usuarioService.login(request.email(), request.senha());

        return ResponseEntity.ok(
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        HttpStatus.OK.value(),
                        "Login realizado com sucesso",
                        new LoginResponse(token)
                )
        );
    }
}