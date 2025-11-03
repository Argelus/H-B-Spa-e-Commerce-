// src/main/java/com/spa/security/reset/PasswordResetService.java
package com.spa.security.reset;

import com.spa.security.model.Usuario;
import com.spa.security.repository.UsuarioRepository;
import com.spa.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@Transactional
public class PasswordResetService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetCodeRepository codeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final SecureRandom random = new SecureRandom();

    @Value("${reset.otp.length:6}")
    private int otpLength;

    @Value("${reset.otp.ttl-minutes:10}")
    private long ttlMinutes;

    @Value("${reset.otp.resend-seconds:60}")
    private long resendSeconds;

    public PasswordResetService(UsuarioRepository usuarioRepository,
                                PasswordResetCodeRepository codeRepository,
                                PasswordEncoder passwordEncoder,
                                EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.codeRepository = codeRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ------------------------------------------------------------------------------------
    // Métodos wrapper que usa tu Controller
    // ------------------------------------------------------------------------------------

    /** Envía un código de verificación al email (o username si lo habilitas). */
    public void issueCode(String emailOrUsername) {
        startByEmailOrUsername(emailOrUsername);
    }

    /** Verifica el código y actualiza la contraseña. */
    public void resetWithCode(String emailOrUsername, String code, String newPassword) {
        Usuario user = resolveUser(emailOrUsername);
        verifyCode(user.getId(), code);
        resetPassword(user.getId(), code, newPassword);
    }

    // ------------------------------------------------------------------------------------
    // Lógica principal
    // ------------------------------------------------------------------------------------

    /** Genera (o regenera) un código y lo envía por correo. Aplica rate-limit. */
    public void startByEmailOrUsername(String emailOrUsername) {
        Usuario u = resolveUser(emailOrUsername);

        // Rate-limit para evitar spam de reenvío
        codeRepository.findTopByUsuarioIdOrderByCreatedAtDesc(u.getId())
                .ifPresent(last -> {
                    if (last.getLastSentAt() != null &&
                            ChronoUnit.SECONDS.between(last.getLastSentAt(), LocalDateTime.now()) < resendSeconds) {
                        throw new IllegalStateException("Espera antes de solicitar otro código.");
                    }
                });

        PasswordResetCode c = new PasswordResetCode();
        c.setUsuario(u);
        c.setCode(generateCode());
        c.setStatus(PasswordResetCode.Status.PENDING);
        c.setExpiresAt(LocalDateTime.now().plusMinutes(ttlMinutes));
        c.setLastSentAt(LocalDateTime.now());
        codeRepository.save(c);

        // Enviar email con tu servicio actual
        emailService.enviarCodigoReset(
                u.getEmail(),
                c.getCode(),
                Duration.ofMinutes(ttlMinutes)
        );
    }

    /** Verifica que el código coincida y esté vigente; marca como VERIFIED. */
    public void verifyCode(Long userId, String code) {
        PasswordResetCode c = codeRepository
                .findTopByUsuarioIdAndStatusOrderByCreatedAtDesc(userId, PasswordResetCode.Status.PENDING)
                .orElseThrow(() -> new IllegalStateException("No hay código activo."));

        if (LocalDateTime.now().isAfter(c.getExpiresAt())) {
            c.setStatus(PasswordResetCode.Status.EXPIRED);
            throw new IllegalStateException("El código ha expirado.");
        }

        if (!c.getCode().equals(code)) {
            c.setAttempts(c.getAttempts() + 1);
            throw new IllegalArgumentException("Código incorrecto.");
        }

        c.setStatus(PasswordResetCode.Status.VERIFIED);
    }

    /** Cambia la contraseña si el código ya fue verificado y no está expirado. */
    public void resetPassword(Long userId, String code, String newPassword) {
        PasswordResetCode c = codeRepository
                .findTopByUsuarioIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new IllegalStateException("No hay solicitud de restablecimiento."));

        if (!c.getCode().equals(code) || c.getStatus() != PasswordResetCode.Status.VERIFIED) {
            throw new IllegalStateException("Código no verificado.");
        }
        if (LocalDateTime.now().isAfter(c.getExpiresAt())) {
            c.setStatus(PasswordResetCode.Status.EXPIRED);
            throw new IllegalStateException("El código ha expirado.");
        }

        Usuario u = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Usuario no encontrado."));
        u.setPassword(passwordEncoder.encode(newPassword));

        c.setStatus(PasswordResetCode.Status.USED);
    }

    // ------------------------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------------------------

    /** Resuelve el usuario por email (o username si lo habilitas). */
    private Usuario resolveUser(String emailOrUsername) {
        if (emailOrUsername.contains("@")) {
            return usuarioRepository.findByEmail(emailOrUsername.trim().toLowerCase())
                    .orElseThrow(() -> new IllegalArgumentException("Email no registrado."));
        }
        // Si deseas permitir username:
        return usuarioRepository.findByUsername(emailOrUsername.trim())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no registrado."));
    }

    /** Genera un OTP numérico de longitud configurada. */
    private String generateCode() {
        String digits = "0123456789";
        StringBuilder sb = new StringBuilder(otpLength);
        for (int i = 0; i < otpLength; i++) {
            sb.append(digits.charAt(random.nextInt(digits.length())));
        }
        return sb.toString();
    }
}
