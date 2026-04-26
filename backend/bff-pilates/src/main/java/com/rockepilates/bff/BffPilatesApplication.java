package com.rockepilates.bff;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class BffPilatesApplication {

    public static void main(String[] args) {
        SpringApplication.run(BffPilatesApplication.class, args);
    }
}