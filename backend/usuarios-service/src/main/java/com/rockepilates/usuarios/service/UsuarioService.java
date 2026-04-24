package com.rockepilates.usuarios.service;

import com.rockepilates.usuarios.domain.Role;
import com.rockepilates.usuarios.domain.Usuario;
import com.rockepilates.usuarios.dto.CreateUsuarioRequest;
import com.rockepilates.usuarios.dto.PagedResponse;
import com.rockepilates.usuarios.dto.UpdateSenhaRequest;
import com.rockepilates.usuarios.dto.UpdateUsuarioRequest;
import com.rockepilates.usuarios.dto.UsuarioResponse;
import com.rockepilates.usuarios.exception.ConflictException;
import com.rockepilates.usuarios.exception.ResourceNotFoundException;
import com.rockepilates.usuarios.mapper.UsuarioMapper;
import com.rockepilates.usuarios.repository.UsuarioRepository;
import com.rockepilates.usuarios.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthorizationService authorizationService;

    public UsuarioResponse criarUsuario(CreateUsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email já cadastrado");
        }

        Usuario usuario = usuarioMapper.toEntity(request);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setRole(Role.USER);
        usuario.setAtivo(true);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return usuarioMapper.toResponse(usuarioSalvo);
    }

    public UsuarioResponse buscarPorId(Long id, Authentication authentication) {
        authorizationService.validateSelfOrAdmin(id, authentication);

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        return usuarioMapper.toResponse(usuario);
    }

    public PagedResponse<UsuarioResponse> listarUsuarios(Pageable pageable) {
        var page = usuarioRepository.findAll(pageable)
                .map(usuarioMapper::toResponse);

        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    public UsuarioResponse atualizarUsuario(Long id, UpdateUsuarioRequest request, Authentication authentication) {
        authorizationService.validateSelfOrAdmin(id, authentication);

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!usuario.getEmail().equals(request.email())
                && usuarioRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email já cadastrado");
        }

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());

        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponse(usuarioAtualizado);
    }

    public void alterarSenha(Long id, UpdateSenhaRequest request, Authentication authentication) {
        authorizationService.validateSelfOrAdmin(id, authentication);

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.senhaAtual(), usuario.getSenha())) {
            throw new ConflictException("Senha atual inválida");
        }

        usuario.setSenha(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);
    }

    public String login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new ConflictException("Senha inválida");
        }

        return jwtService.generateToken(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getRole()
        );
    }
}