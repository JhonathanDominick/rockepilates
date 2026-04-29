package com.rockepilates.gerenciador.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "site_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String chave;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String valor;
}