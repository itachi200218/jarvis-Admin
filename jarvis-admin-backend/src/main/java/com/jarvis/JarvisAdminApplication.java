package com.jarvis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing   // ✅ REQUIRED
public class JarvisAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(JarvisAdminApplication.class, args);
    }
}
