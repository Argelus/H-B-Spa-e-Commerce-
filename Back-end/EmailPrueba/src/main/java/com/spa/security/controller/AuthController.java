package com.spa.security.controller;

// 📦 DTOs: objetos que viajan entre el front y el back
import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest;

// 🔐 Utilidad para generar y validar tokens JWT
import com.spa.security.jwt.JwtUtil;

// 🧩 Clases del modelo y lógica de usuario
import com.spa.security.model.Usuario;
import com.spa.security.repository.UsuarioRepository;
import com.spa.service.UsuarioService;

// ⚙️ Dependencias de Spring Security
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

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(
            AuthenticationManager authManager,
            JwtUtil jwtUtil,
            UsuarioService usuarioService,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ============================================================
    // 🟢 LOGIN: Autentica credenciales y devuelve un token JWT
    // ============================================================
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest loginRequest) {

        // 1️⃣ Autenticar al usuario con Spring Security
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // 2️⃣ Buscar el usuario en la base de datos
        Usuario user = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de autenticar"));

        // 3️⃣ Normalizar el rol
        String role = user.getRole();
        if (role == null || !role.startsWith("ROLE_")) {
            role = "ROLE_" + (role != null ? role.toUpperCase() : "USER");
        }

        // 4️⃣ Generar token JWT con username y rol
        String token = jwtUtil.generateToken(user.getUsername(), role);

        // 5️⃣ Devolver respuesta al frontend
        return Map.of(
                "message", "Login exitoso",
                "token", token,
                "username", user.getUsername(),
                "role", role
        );
    }

    // ============================================================
    // 🟣 REGISTER: Crea un nuevo usuario y devuelve token
    // ============================================================
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequest registerRequest) {

        // 1️⃣ Validaciones: evitar duplicados
        if (usuarioService.existePorUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Error: El nombre de usuario ya existe.");
        }
        if (usuarioService.existePorEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: El email ya está en uso.");
        }

        // 2️⃣ Normalizar el rol
        String role = registerRequest.getRole();
        if (role == null || role.isBlank()) {
            role = "ROLE_USER";
        } else if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        }

        // 3️⃣ Crear la entidad Usuario y encriptar la contraseña
        Usuario usuario = new Usuario();
        usuario.setUsername(registerRequest.getUsername());
        usuario.setEmail(registerRequest.getEmail());
        usuario.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        usuario.setRole(role);

        // 4️⃣ Guardar el usuario en la base de datos
        usuarioService.guardarUsuario(usuario);

        // 5️⃣ Generar token automático (útil para login inmediato tras registro)
        String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRole());

        // 6️⃣ Respuesta al frontend
        return Map.of(
                "message", "Usuario registrado correctamente",
                "username", usuario.getUsername(),
                "role", usuario.getRole(),
                "token", token
        );
    }
}
