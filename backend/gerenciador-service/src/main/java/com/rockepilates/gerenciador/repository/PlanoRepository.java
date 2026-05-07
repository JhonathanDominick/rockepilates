package com.rockepilates.gerenciador.repository;

import com.rockepilates.gerenciador.entity.Plano;
import com.rockepilates.gerenciador.enums.TipoPlano;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlanoRepository extends JpaRepository<Plano, Long> {

    Optional<Plano> findByTipoAndAtivoTrue(TipoPlano tipo);
}