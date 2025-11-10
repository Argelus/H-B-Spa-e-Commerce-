package com.spa.security.config;

import com.spa.security.jwt.JwtUtil;
import com.spa.security.service.UsuarioDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UsuarioDetailsServiceImpl userDetailsService;

    public JwtRequestFilter(JwtUtil jwtUtil, UsuarioDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔹 Permitir las solicitudes preflight OPTIONS sin validación JWT
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            filterChain.doFilter(request, response);
            return;
        }

        // 🔹 Leer el encabezado Authorization
        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // Debug temporal — ver si llega el header al backend
        if (authHeader != null) {
            System.out.println("Header Authorization recibido: " + authHeader);
        } else {
            System.out.println("No se encontró header Authorization en " + request.getRequestURI());
        }

        // 🔍 Extraer el token si empieza con "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                System.out.println("Error al extraer username del token: " + e.getMessage());
            }
        }

        // Validar token y establecer autenticación
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtUtil.isTokenValid(jwt, userDetails.getUsername())) {

                String role = jwtUtil.extractRole(jwt);
                System.out.println("Token válido para usuario: " + username + " con rol: " + role);

                // Normaliza el rol para evitar ROLE_ROLE_ADMIN o ADMIN sin prefijo
                String normalizedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;

                var authorities = List.of(new SimpleGrantedAuthority(normalizedRole));
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Autoridad establecida en contexto: " + normalizedRole);

            } else {
                System.out.println("Token inválido o expirado para usuario: " + username);
            }
        }

        filterChain.doFilter(request, response);
    }
}
