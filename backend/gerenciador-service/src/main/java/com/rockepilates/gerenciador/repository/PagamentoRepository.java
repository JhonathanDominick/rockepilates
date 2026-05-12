package com.rockepilates.gerenciador.repository;

import com.rockepilates.gerenciador.entity.Assinatura;
import com.rockepilates.gerenciador.entity.Pagamento;
import com.rockepilates.gerenciador.enums.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    Optional<Pagamento> findFirstByAssinaturaAndStatusOrderByDataVencimentoDesc(
            Assinatura assinatura,
            StatusPagamento status
    );

    Optional<Pagamento> findFirstByAssinaturaOrderByDataVencimentoDesc(
            Assinatura assinatura
    );

    List<Pagamento> findByAssinaturaIdOrderByDataVencimentoDesc(Long assinaturaId);

    List<Pagamento> findByStatusAndDataVencimentoBefore(
            StatusPagamento status,
            LocalDate data
    );

    long countByStatus(StatusPagamento status);

    List<Pagamento> findByStatusAndDataPagamentoBetween(
            StatusPagamento status,
            LocalDate inicio,
            LocalDate fim
    );

    List<Pagamento> findByStatusIn(List<StatusPagamento> status);

    List<Pagamento> findTop5ByOrderByCriadoEmDesc();
}

