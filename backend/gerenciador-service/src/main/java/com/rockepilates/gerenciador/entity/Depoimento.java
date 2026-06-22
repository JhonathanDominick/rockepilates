package com.rockepilates.gerenciador.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "depoimento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Depoimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(columnDefinition = "TEXT")
    private String mensagem;

    private Boolean aprovado;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;
}