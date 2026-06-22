package com.rockepilates.gerenciador.repository;

import com.rockepilates.gerenciador.entity.Depoimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepoimentoRepository extends JpaRepository<Depoimento, Long> {

    List<Depoimento> findByAprovadoTrueOrderByCriadoEmDesc();

    List<Depoimento> findAllByOrderByCriadoEmDesc();

}