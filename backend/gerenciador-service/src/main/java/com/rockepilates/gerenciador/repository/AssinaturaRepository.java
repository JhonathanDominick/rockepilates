package com.rockepilates.gerenciador.repository;

import com.rockepilates.gerenciador.entity.Assinatura;
import com.rockepilates.gerenciador.enums.StatusAssinatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;

public interface AssinaturaRepository extends JpaRepository<Assinatura, Long>,
        JpaSpecificationExecutor<Assinatura> {

    List<Assinatura> findByStatus(StatusAssinatura status);

    List<Assinatura> findByDataVencimentoBetween(LocalDate inicio, LocalDate fim);

    List<Assinatura> findByAlunoIdOrderByCriadoEmDesc(Long alunoId);

    long countByStatus(StatusAssinatura status);
}