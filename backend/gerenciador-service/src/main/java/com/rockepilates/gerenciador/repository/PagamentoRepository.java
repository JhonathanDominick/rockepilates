package com.rockepilates.gerenciador.repository;

import com.rockepilates.gerenciador.entity.Assinatura;
import com.rockepilates.gerenciador.entity.Pagamento;
import com.rockepilates.gerenciador.enums.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;

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
}