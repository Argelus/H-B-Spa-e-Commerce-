package com.spa.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    // 🔑 Genera la clave de firma segura
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // 🪪 Genera un token con username y rol
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // Guarda el rol dentro del token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 🧩 Extrae el nombre de usuario desde el token
    public String extractUsername(String token) {
        try {
            return getAllClaims(token).getSubject();
        } catch (JwtException e) {
            System.out.println("⚠️ Error al extraer username: " + e.getMessage());
            return null;
        }
    }

    // 🧩 Extrae el rol del token (ej: ROLE_ADMIN o ROLE_CLIENTE)
    public String extractRole(String token) {
        try {
            String role = getAllClaims(token).get("role", String.class);
            return role != null ? role : "ROLE_CLIENTE"; // por defecto si no existe
        } catch (JwtException e) {
            System.out.println("⚠️ Error al extraer rol: " + e.getMessage());
            return "ROLE_CLIENTE";
        }
    }

    // 🔍 Verifica si el token es válido
    public boolean isTokenValid(String token, String username) {
        try {
            String extractedUsername = extractUsername(token);
            return (extractedUsername != null &&
                    extractedUsername.equals(username) &&
                    !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("⚠️ Token inválido o manipulado: " + e.getMessage());
            return false;
        }
    }

    // ⏰ Comprueba si expiró
    private boolean isTokenExpired(String token) {
        try {
            return getAllClaims(token).getExpiration().before(new Date());
        } catch (JwtException e) {
            return true;
        }
    }

    // 📦 Obtiene todos los claims del token
    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
