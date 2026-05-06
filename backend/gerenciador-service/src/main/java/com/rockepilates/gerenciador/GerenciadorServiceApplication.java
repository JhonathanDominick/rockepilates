package com.rockepilates.gerenciador;

import com.rockepilates.gerenciador.config.StorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class GerenciadorServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GerenciadorServiceApplication.class, args);
    }
}