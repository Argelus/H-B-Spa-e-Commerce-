// src/main/java/com/spa/security/reset/PasswordResetCodeRepository.java
package com.spa.security.reset;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetCodeRepository
        extends JpaRepository<PasswordResetCode, Long> {

    Optional<PasswordResetCode> findTopByUsuarioIdAndStatusOrderByCreatedAtDesc(
            Long usuarioId, PasswordResetCode.Status status);

    Optional<PasswordResetCode> findTopByUsuarioIdOrderByCreatedAtDesc(Long usuarioId);
}
