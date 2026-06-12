package com.rockepilates.gerenciador.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria_redefinicao_senha_aluno")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditoriaRedefinicaoSenhaAluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "aluno_id", nullable = false)
    private Long alunoId;

    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @Column(name = "admin_email", nullable = false, length = 150)
    private String adminEmail;

    @Column(name = "admin_role", nullable = false, length = 30)
    private String adminRole;

    @Column(name = "realizado_em", nullable = false)
    private LocalDateTime realizadoEm;

    @PrePersist
    public void prePersist() {
        if (realizadoEm == null) {
            realizadoEm = LocalDateTime.now();
        }
    }
}
