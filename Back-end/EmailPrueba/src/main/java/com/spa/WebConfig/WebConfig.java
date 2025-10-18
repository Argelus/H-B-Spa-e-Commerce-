package com.spa.WebConfig; // 🔹 Cambia el paquete a "config" (no "WebConfig")

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "http://127.0.0.1:5500",
                                "http://localhost:5500",
                                "http://127.0.0.1:5501",
                                "http://localhost:5501",
                                "http://localhost:5050"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 🔹 Incluye todos los métodos REST
                        .allowedHeaders("*")
                        .allowCredentials(true); // 🔹 True si tu frontend envía cookies o tokens
            }
        };
    }
}
