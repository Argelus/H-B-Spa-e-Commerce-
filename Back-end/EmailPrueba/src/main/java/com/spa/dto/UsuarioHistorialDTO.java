package com.spa.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioHistorialDTO {

    // 🧍 Datos básicos del usuario
    private Long id;
    private String username;
    private String email;

    // 🛒 Historial de órdenes
    private List<OrdenDTO> orders;

    // 💆 Historial de reservas
    private List<ReservaDTO> reservas;

    // === Clases internas DTO simples ===
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrdenDTO {
        private Long id;
        private BigDecimal total;
        private String estado;
        private LocalDateTime fechaCreacion;
        private List<ItemDTO> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemDTO {
        private String nombreProducto;
        private int cantidad;
        private BigDecimal subtotal;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReservaDTO {
        private Long id;
        private String servicio;
        private LocalDate fecha;
        private LocalTime hora;
        private String estado;
        private String nota;
    }
}
