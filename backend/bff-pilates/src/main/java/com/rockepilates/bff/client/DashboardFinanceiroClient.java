package com.rockepilates.bff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(name = "dashboardFinanceiroClient", url = "${gerenciador.url}")
public interface DashboardFinanceiroClient {

    @GetMapping("/dashboard/financeiro")
    Map<String, Object> buscarDashboard();
}