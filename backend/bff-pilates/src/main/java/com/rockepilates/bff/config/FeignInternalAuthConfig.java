package com.rockepilates.bff.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class FeignInternalAuthConfig {

    public static final String HEADER_NAME = "X-Internal-Service-Token";

    @Value("${internal.service.token}")
    private String internalServiceToken;

    @Bean
    public RequestInterceptor internalServiceTokenInterceptor() {
        return template -> template.header(HEADER_NAME, internalServiceToken);
    }
}
