package com.rockepilates.gerenciador.entity;

import com.rockepilates.gerenciador.enums.TipoPlano;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "plano")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 30)
    private TipoPlano tipo;

    @Column(nullable = false, length = 80)
    private String nome;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "duracao_meses", nullable = false)
    private Integer duracaoMeses;

    @Column(nullable = false)
    private Boolean ativo;

    @PrePersist
    public void prePersist() {
        ativo = true;
    }
}