package com.rockepilates.gerenciador.repository;

import com.rockepilates.gerenciador.entity.SiteConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SiteConfigRepository extends JpaRepository<SiteConfig, Long> {

    Optional<SiteConfig> findByChave(String chave);
}