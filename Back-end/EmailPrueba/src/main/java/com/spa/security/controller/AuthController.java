package com.spa.security.controller;

import com.spa.security.jwt.JwtUtil;
import com.spa.security.model.Usuario;
import com.spa.security.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil,
                          UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 🟢 LOGIN: genera token JWT
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.get("username"),
                        request.get("password")
                )
        );

        // 🔍 Buscar usuario autenticado en BD
        Usuario user = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 🧩 Normalizar el rol para que siempre empiece con ROLE_
        String role = user.getRole();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        }

        // 🪪 Generar token JWT con username + rol
        String token = jwtUtil.generateToken(user.getUsername(), role);

        System.out.println("✅ Login exitoso de usuario: " + user.getUsername() + " con rol: " + role);

        return Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", role
        );
    }

    // 🟣 REGISTER: crea un nuevo usuario
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        // 🔐 Encriptar contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // ⚙️ Rol por defecto si no se envía
        String role = usuario.getRole();
        if (role == null || role.isBlank()) {
            role = "ROLE_USER";
        } else if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        }
        usuario.setRole(role);

        usuarioRepository.save(usuario);

        System.out.println("🟢 Usuario registrado: " + usuario.getUsername() + " con rol: " + role);

        return Map.of(
                "message", "Usuario registrado correctamente",
                "username", usuario.getUsername(),
                "role", role
        );
    }
}
