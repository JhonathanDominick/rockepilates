package com.rockepilates.bff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "alunoClient", url = "${gerenciador.url}")
public interface AlunoClient {

    @PostMapping("/alunos")
    void cadastrar(@RequestBody Map<String, Object> body);

    @GetMapping("/alunos/admin")
    List<Map<String, Object>> listarAdmin();

    @PatchMapping("/alunos/assinaturas/{id}/pagar")
    void marcarComoPago(@PathVariable Long id);

    @GetMapping("/alunos/assinaturas/{id}/pagamentos")
    List<Map<String, Object>> listarPagamentosPorAssinatura(@PathVariable Long id);


}