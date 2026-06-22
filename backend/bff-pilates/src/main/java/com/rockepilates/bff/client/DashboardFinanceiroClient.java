package com.rockepilates.bff.client;

import com.rockepilates.bff.config.FeignInternalAuthConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@FeignClient(
        name = "dashboardFinanceiroClient",
        url = "${gerenciador.url}",
        configuration = FeignInternalAuthConfig.class,
        fallback = DashboardFinanceiroClientFallback.class
)
public interface DashboardFinanceiroClient {

    @GetMapping("/dashboard/financeiro")
    Map<String, Object> buscarDashboard();
}
