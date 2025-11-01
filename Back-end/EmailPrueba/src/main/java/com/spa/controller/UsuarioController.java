package com.spa.controller;

import com.spa.dto.UsuarioHistorialDTO;
import com.spa.security.model.Usuario;
import com.spa.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ✅ NUEVO: Perfil del usuario autenticado (lee el username del token)
    @GetMapping("/me")
    public PerfilDTO me(org.springframework.security.core.Authentication auth) {
        Usuario u = usuarioService.buscarPorUsername(auth.getName());
        return new PerfilDTO(u.getId(), u.getUsername(), u.getEmail(), u.getRole());
    }

    // EXISTENTE: Historial por ID (lo dejamos tal cual)
    @GetMapping("/{id}/historial")
    public ResponseEntity<UsuarioHistorialDTO> obtenerHistorial(@PathVariable Long id) {
        UsuarioHistorialDTO historial = usuarioService.obtenerHistorial(id);
        return ResponseEntity.ok(historial);
    }

    // DTO compacto para /me
    public record PerfilDTO(Long id, String username, String email, String role) {}
}
