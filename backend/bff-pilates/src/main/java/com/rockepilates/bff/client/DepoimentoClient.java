package com.rockepilates.bff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "depoimento-client", url = "${gerenciador.url}")
public interface DepoimentoClient {

    @PostMapping("/depoimentos")
    Map<String, Object> criar(@RequestBody Map<String, String> body);

    @GetMapping("/depoimentos")
    List<Map<String, Object>> listar();

    @GetMapping("/depoimentos/admin")
    List<Map<String, Object>> listarAdmin();

    @PatchMapping("/depoimentos/{id}/aprovar")
    Map<String, Object> aprovar(@PathVariable Long id);

    @PatchMapping("/depoimentos/{id}/desaprovar")
    Map<String, Object> desaprovar(@PathVariable Long id);
}