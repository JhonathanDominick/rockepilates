package com.rockepilates.bff.config;

import feign.Retryer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import feign.Client;
import feign.okhttp.OkHttpClient;


@Configuration
public class FeignConfig {

    @Bean
    public Retryer retryer() {
        return new Retryer.Default(
                100,
                1000,
                3
        );
    }

    @Bean
    public Client feignClient() {
        return new OkHttpClient();
    }
}