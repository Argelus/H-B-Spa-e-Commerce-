package com.spa.security.controller; // 1. Paquete principal

// Tus DTOs
import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest; // 2. Usamos el DTO de registro

// Tu utilidad JWT
import com.spa.security.jwt.JwtUtil;

// Clases de tu lógica
import com.spa.security.repository.UsuarioRepository;
import com.spa.security.model.Usuario;
import com.spa.service.UsuarioService;      // 4. Servicio para lógica de registro

// Dependencias de Spring Security
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // 5. Inyección por constructor (como en tu nuevo archivo)
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository; // Necesario para buscar el rol
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil,
                          UsuarioService usuarioService, UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Endpoint de Login
     * (Lógica de tu nuevo controller, devuelve Map<String, String>)
     */
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // Buscar usuario en BD para obtener el rol correcto
        Usuario user = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de autenticar"));

        // Normalizar el rol (buena práctica de tu controller)
        String role = user.getRole();
        if (role == null || !role.startsWith("ROLE_")) {
            role = "ROLE_" + (role != null ? role.toUpperCase() : "USER");
        }

        // Generar token con tu JwtUtil
        String token = jwtUtil.generateToken(user.getUsername(), role);

        // Devolver el Map (como en tu nuevo controller)
        return Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", role
        );
    }

    /**
     * Endpoint de Registro
     * (Lógica de mi controller, usa RegisterRequest DTO por seguridad)
     */
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequest registerRequest) {

        // 1. Validar usando el Servicio
        if (usuarioService.existePorUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Error: El nombre de usuario ya existe.");
        }

        if (usuarioService.existePorEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: El email ya está en uso.");
        }

        // 2. Normalizar el rol (lógica de tu nuevo controller)
        String role = registerRequest.getRole();
        if (role == null || role.isBlank()) {
            role = "ROLE_USER";
        } else if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        }

        // 3. Crear la entidad Usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(registerRequest.getUsername());
        usuario.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        usuario.setRole(role);

        // 4. Guardar usando el Servicio
        usuarioService.guardarUsuario(usuario);

        // 5. Devolver Map (como en tu nuevo controller)
        return Map.of(
                "message", "Usuario registrado correctamente",
                "username", usuario.getUsername(),
                "role", usuario.getRole()
        );
    }
}