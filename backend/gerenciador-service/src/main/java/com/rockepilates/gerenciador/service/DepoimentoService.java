package com.rockepilates.gerenciador.service;

import com.rockepilates.gerenciador.entity.Depoimento;
import com.rockepilates.gerenciador.repository.DepoimentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.rockepilates.gerenciador.dto.DepoimentoRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepoimentoService {

    private final DepoimentoRepository repository;

    public Depoimento criar(DepoimentoRequest request) {

        String nome = request.nome().trim();
        String mensagem = request.mensagem().trim();

        // proteção básica contra spam
        long caracteresDistintos = mensagem
                .toLowerCase()
                .chars()
                .filter(Character::isLetterOrDigit)
                .distinct()
                .count();

        if (caracteresDistintos < 5) {
            throw new IllegalArgumentException("Mensagem inválida");
        }

        Depoimento depoimento = Depoimento.builder()
                .nome(nome)
                .mensagem(mensagem)
                .aprovado(false)
                .criadoEm(LocalDateTime.now())
                .build();

        return repository.save(depoimento);
    }

    public List<Depoimento> listarAprovados() {
        return repository.findByAprovadoTrueOrderByCriadoEmDesc();
    }

    public List<Depoimento> listarTodos() {
        return repository.findAllByOrderByCriadoEmDesc();
    }

    public Depoimento aprovar(Long id) {
        Depoimento depoimento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Depoimento não encontrado"));

        depoimento.setAprovado(true);
        return repository.save(depoimento);
    }

    public Depoimento desaprovar(Long id) {
        Depoimento depoimento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Depoimento não encontrado"));

        depoimento.setAprovado(false);
        return repository.save(depoimento);
    }
}