package com.spa.service;

import com.spa.dto.UsuarioHistorialDTO;
import com.spa.model.Order;
import com.spa.model.Reserva;
import com.spa.security.model.Usuario;
import com.spa.repository.OrderRepository;
import com.spa.repository.ReservaRepository;
import com.spa.security.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    // ✅ Método existente: guardar usuario (registro)
    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // ✅ Método existente: verificar si username ya existe
    public boolean existePorUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    // ✅ Método existente: verificar si email ya existe
    public boolean existePorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    // 🟩 NUEVO: obtener historial completo del usuario
    public UsuarioHistorialDTO obtenerHistorial(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
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

        // 📦 Armar el DTO de respuesta final
        return UsuarioHistorialDTO.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .orders(ordenes)
                .reservas(reservas)
                .build();
    }
}
