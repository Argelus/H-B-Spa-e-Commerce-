package com.spa.security.config;

import com.spa.security.model.Usuario;
import com.spa.security.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDefaultUsers(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            // Crear usuario ADMIN si no existe
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("12345"));
                admin.setRole("ROLE_ADMIN");
                usuarioRepository.save(admin);
                System.out.println("Usuario ADMIN creado: admin / 12345");
            } else {
                System.out.println("Usuario admin ya existe, no se recreó.");
            }

            // Crear usuario normal si no existe
            if (usuarioRepository.findByUsername("cliente").isEmpty()) {
                Usuario user = new Usuario();
                user.setUsername("cliente");
                user.setPassword(passwordEncoder.encode("12345"));
                user.setRole("ROLE_USER");
                usuarioRepository.save(user);
                System.out.println("Usuario CLIENTE creado: cliente / 12345");
            } else {
                System.out.println("Usuario cliente ya existe, no se recreó.");
            }
        };
    }
}
