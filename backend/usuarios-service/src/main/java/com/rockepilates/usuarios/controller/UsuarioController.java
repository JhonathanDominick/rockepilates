package com.rockepilates.usuarios.controller;

import com.rockepilates.usuarios.dto.CreateUsuarioRequest;
import com.rockepilates.usuarios.dto.PagedResponse;
import com.rockepilates.usuarios.dto.UpdateUsuarioRequest;
import com.rockepilates.usuarios.dto.UsuarioResponse;
import com.rockepilates.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse criarUsuario(
            @RequestBody @Valid CreateUsuarioRequest request
    ) {
        return usuarioService.criarUsuario(request);
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @GetMapping
    public PagedResponse<UsuarioResponse> listarUsuarios(Pageable pageable) {
        return usuarioService.listarUsuarios(pageable);
    }

    @PutMapping("/{id}")
    public UsuarioResponse atualizarUsuario(
            @PathVariable Long id,
            @RequestBody @Valid UpdateUsuarioRequest request) {

        return usuarioService.atualizarUsuario(id, request);
    }
}