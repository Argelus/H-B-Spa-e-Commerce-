package com.spa.controller;

import com.spa.security.model.Usuario;
import com.spa.security.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios/me")
@CrossOrigin(origins = "*")
public class UsuarioPasswordController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioPasswordController(UsuarioRepository usuarioRepository,
                                     PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(Authentication auth,
                                            @RequestBody ChangePwd req) {
        Usuario u = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(req.oldPassword(), u.getPassword())) {
            return ResponseEntity.badRequest().body(new Msg("Contraseña actual inválida"));
        }
        if (req.newPassword() == null || req.newPassword().length() < 8) {
            return ResponseEntity.badRequest().body(new Msg("La nueva contraseña debe tener al menos 8 caracteres"));
        }

        u.setPassword(passwordEncoder.encode(req.newPassword()));
        usuarioRepository.save(u);
        return ResponseEntity.ok(new Msg("Contraseña actualizada"));
    }

    public record ChangePwd(String oldPassword, String newPassword) {}
    public record Msg(String message) {}
}
