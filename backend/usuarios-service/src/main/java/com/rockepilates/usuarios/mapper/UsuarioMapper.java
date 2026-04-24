package com.rockepilates.usuarios.mapper;

import com.rockepilates.usuarios.domain.Usuario;
import com.rockepilates.usuarios.dto.CreateUsuarioRequest;
import com.rockepilates.usuarios.dto.UsuarioResponse;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario toEntity(CreateUsuarioRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setSenha(request.senha());
        return usuario;
    }

    public UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole().name(),
                usuario.getAtivo()
        );
    }
}