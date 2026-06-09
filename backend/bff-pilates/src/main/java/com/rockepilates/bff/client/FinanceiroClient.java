package com.rockepilates.bff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(name = "financeiroClient", url = "${gerenciador.url}", fallback = FinanceiroClientFallback.class)
public interface FinanceiroClient {

    @GetMapping("/financeiro/pagamentos")
    Map<String, Object> listarPagamentos();
}
