package com.spa.model;

import com.spa.security.model.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_reserva", nullable = false)
    private LocalDate fechaReserva;

    @Column(name = "hora_reserva", nullable = false)
    private LocalTime horaReserva;

    /**
     * Estado actual de la reserva.
     * Puede ser: PENDIENTE, EN_CONTACTO, CONFIRMADA, CANCELADA.
     */
    @Column(length = 50, nullable = false)
    private String estado = "PENDIENTE";

    /**
     * Comentarios opcionales del cliente o notas internas del administrador.
     */
    @Column(length = 500)
    private String nota;

    /**
     * Teléfono del cliente, usado para confirmaciones o envío por WhatsApp.
     */
    @Column(length = 20)
    private String telefono;

    /**
     * Medio de confirmación: "WhatsApp", "Llamada", "Presencial", etc.
     */
    @Column(name = "metodo_confirmacion", length = 50)
    private String metodoConfirmacion;

    /**
     * Usuario que realizó la reserva.
     * Relación: muchas reservas pueden pertenecer a un mismo usuario.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    /**
     * Servicio reservado.
     * Relación: muchas reservas pueden pertenecer al mismo servicio.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "spa_service_id", nullable = false)
    private SpaService spaService;

    /**
     * Marca de tiempo automática para cuando se crea la reserva.
     */
    @Column(name = "creado_en", updatable = false)
    private LocalDate creadoEn = LocalDate.now();
}
