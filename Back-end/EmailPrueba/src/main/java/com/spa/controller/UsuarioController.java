package com.spa.controller;

import com.spa.dto.UsuarioHistorialDTO;
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

    @GetMapping("/{id}/historial")
    public ResponseEntity<UsuarioHistorialDTO> obtenerHistorial(@PathVariable Long id) {
        UsuarioHistorialDTO historial = usuarioService.obtenerHistorial(id);
        return ResponseEntity.ok(historial);
    }
}
