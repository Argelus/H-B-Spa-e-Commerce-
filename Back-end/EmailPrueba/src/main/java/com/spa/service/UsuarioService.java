package com.spa.service;

import com.spa.dto.UsuarioHistorialDTO;
import com.spa.security.model.Usuario;
import com.spa.repository.OrderRepository;
import com.spa.repository.ReservaRepository;
import com.spa.security.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    // ✅ Guardar usuario (registro)
    @Transactional
    public Usuario guardarUsuario(Usuario usuario) {
        // Normaliza email a minúsculas por consistencia
        if (usuario.getEmail() != null) {
            usuario.setEmail(usuario.getEmail().trim().toLowerCase());
        }
        if (usuario.getUsername() != null) {
            usuario.setUsername(usuario.getUsername().trim());
        }
        return usuarioRepository.save(usuario);
    }

    // ✅ Verificar si username ya existe (normalizado)
    @Transactional(readOnly = true)
    public boolean existePorUsername(String username) {
        if (username == null) return false;
        return usuarioRepository.existsByUsername(username.trim());
    }

    // ✅ Verificar si email ya existe (normalizado)
    @Transactional(readOnly = true)
    public boolean existePorEmail(String email) {
        if (email == null) return false;
        return usuarioRepository.existsByEmail(email.trim().toLowerCase());
    }

    // ✅ Buscar por username (para /me y otros)
    @Transactional(readOnly = true)
    public Usuario buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username.trim())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
    }

    // ✅ (Opcional) Buscar por email
    @Transactional(readOnly = true)
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
    }

    // ✅ Historial completo del usuario por ID
    @Transactional(readOnly = true)
    public UsuarioHistorialDTO obtenerHistorial(Long usuarioId) {
        var usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 🛒 Órdenes del usuario
        var ordenes = orderRepository.findByUsuarioId(usuarioId).stream()
                .map(order -> UsuarioHistorialDTO.OrdenDTO.builder()
                        .id(order.getId())
                        .total(order.getTotal())
                        .estado(order.getEstado())
                        .fechaCreacion(order.getFechaCreacion())
                        .items(order.getItems().stream()
                                .map(item -> UsuarioHistorialDTO.ItemDTO.builder()
                                        .nombreProducto(item.getProduct().getName())
                                        .cantidad(item.getQuantity())
                                        .subtotal(item.getTotalPrice())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        // 💆 Reservas del usuario
        var reservas = reservaRepository.findByUsuarioId(usuarioId).stream()
                .map(reserva -> UsuarioHistorialDTO.ReservaDTO.builder()
                        .id(reserva.getId())
                        .servicio(reserva.getSpaService().getName())
                        .fecha(reserva.getFechaReserva())
                        .hora(reserva.getHoraReserva())
                        .estado(reserva.getEstado())
                        .nota(reserva.getNota())
                        .build())
                .collect(Collectors.toList());

        // 📦 Respuesta final
        return UsuarioHistorialDTO.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .orders(ordenes)
                .reservas(reservas)
                .build();
    }
}
