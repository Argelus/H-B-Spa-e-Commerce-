package com.spa.security.repository;

import com.spa.security.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // <-- (Buena práctica)
import java.util.Optional;

@Repository // <-- (Buena práctica)
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // --- MÉTODOS AÑADIDOS ---

    // Para validar en el registro
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // Para buscar (ej. login o validación)
    Optional<Usuario> findByUsername(String username); // <-- Este ya lo tenías

    Optional<Usuario> findByEmail(String email);

}