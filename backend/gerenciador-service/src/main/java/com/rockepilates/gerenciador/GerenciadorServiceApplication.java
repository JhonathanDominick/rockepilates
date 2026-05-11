package com.rockepilates.gerenciador;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GerenciadorServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GerenciadorServiceApplication.class, args);
    }
}