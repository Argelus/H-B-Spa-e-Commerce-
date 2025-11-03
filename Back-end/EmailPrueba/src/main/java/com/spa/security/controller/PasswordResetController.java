package com.spa.security.controller;

import com.spa.security.reset.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/password")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    private final PasswordResetService service;

    public PasswordResetController(PasswordResetService service) {
        this.service = service;
    }

    // 1) Solicitar código (correo con OTP)
    @PostMapping("/forgot")
    public ResponseEntity<?> forgot(@RequestBody ForgotRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            return ResponseEntity.badRequest().body("Email requerido.");
        }
        service.issueCode(req.email());
        return ResponseEntity.ok("Código enviado a tu correo.");
    }

    // 2) Confirmar código y cambiar contraseña
    @PostMapping("/reset")
    public ResponseEntity<?> reset(@RequestBody ResetRequest req) {
        if (req.email() == null || req.email().isBlank() ||
                req.code() == null || req.code().isBlank() ||
                req.newPassword() == null || req.newPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Campos incompletos.");
        }

        service.resetWithCode(req.email(), req.code(), req.newPassword());
        return ResponseEntity.ok("Contraseña actualizada.");
    }

    // DTOs locales (para evitar dependencias externas)
    public record ForgotRequest(String email) {}
    public record ResetRequest(String email, String code, String newPassword) {}
}
