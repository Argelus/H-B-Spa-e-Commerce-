package com.spa.repository;

import com.spa.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // Buscar reservas de un usuario
    List<Reserva> findByUsuarioId(Long usuarioId);

    // Buscar reservas por estado (ej. CONFIRMADA, PENDIENTE, etc.)
    List<Reserva> findByEstado(String estado);

    // Buscar reservas de una fecha específica
    List<Reserva> findByFechaReserva(LocalDate fechaReserva);

    // Verificar si ya existe una reserva en la misma fecha y hora para el mismo servicio
    boolean existsByFechaReservaAndHoraReservaAndSpaServiceId(LocalDate fechaReserva, LocalTime horaReserva, Long spaServiceId);
}
