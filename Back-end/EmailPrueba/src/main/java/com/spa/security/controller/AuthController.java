package com.spa.security.controller;

// 📦 DTOs
import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest;

// 🔐 JWT
import com.spa.security.jwt.JwtUtil;

// 🧩 Modelo/repos y servicio
import com.spa.security.model.Usuario;
import com.spa.security.repository.UsuarioRepository;
import com.spa.service.UsuarioService;

// ⚙️ Spring Security
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

// Utils
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
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
    // 🟢 LOGIN: Acepta username O email y devuelve token JWT
    // ============================================================
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest loginRequest) {

        String input = loginRequest.getUsername(); // puede ser username o email
        String rawPassword = loginRequest.getPassword();

        if (input == null || input.isBlank() || rawPassword == null || rawPassword.isBlank()) {
            throw new RuntimeException("Credenciales incompletas.");
        }

        // Si el input parece email, resolvemos el username real
        String loginUsername = input;
        if (input.contains("@")) {
            Usuario byEmail = usuarioRepository.findByEmail(input.trim().toLowerCase())
                    .orElseThrow(() -> new RuntimeException("No existe un usuario con ese correo."));
            loginUsername = byEmail.getUsername();
        }

        // 1) Autenticar
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginUsername, rawPassword)
        );

        // 2) Buscar entidad usuario
        Usuario user = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de autenticar."));

        // 3) Normalizar rol
        String role = user.getRole();
        if (role == null || !role.startsWith("ROLE_")) {
            role = "ROLE_" + (role != null ? role.toUpperCase() : "USER");
        }

        // 4) Token
        String token = jwtUtil.generateToken(user.getUsername(), role);

        // 5) Respuesta
        return Map.of(
                "message", "Login exitoso",
                "token", token,
                "username", user.getUsername(),
                "role", role
        );
    }

    // ============================================================
    // 🟣 REGISTER: Crea usuario y devuelve token
    // ============================================================
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequest registerRequest) {

        String username = registerRequest.getUsername() != null ? registerRequest.getUsername().trim() : null;
        String email    = registerRequest.getEmail()    != null ? registerRequest.getEmail().trim().toLowerCase() : null;
        String password = registerRequest.getPassword();

        if (username == null || username.isBlank() ||
                email == null || email.isBlank() ||
                password == null || password.isBlank()) {
            throw new RuntimeException("Todos los campos son obligatorios.");
        }

        if (usuarioService.existePorUsername(username)) {
            throw new RuntimeException("Error: El nombre de usuario ya existe.");
        }
        if (usuarioService.existePorEmail(email)) {
            throw new RuntimeException("Error: El email ya está en uso.");
        }

        String role = registerRequest.getRole();
        if (role == null || role.isBlank()) {
            role = "ROLE_USER";
        } else if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role.toUpperCase();
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRole(role);

        usuarioService.guardarUsuario(usuario);

        String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRole());

        return Map.of(
                "message", "Usuario registrado correctamente",
                "username", usuario.getUsername(),
                "role", usuario.getRole(),
                "token", token
        );
    }
}
