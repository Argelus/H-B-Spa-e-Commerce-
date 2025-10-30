package com.spa.service;

import com.spa.model.Reserva;
import com.spa.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    // 🟢 Crear nueva reserva (solo si no existe otra igual en la misma fecha/hora)
    public Reserva crearReserva(Reserva reserva) {
        boolean existe = reservaRepository.existsByFechaReservaAndHoraReservaAndSpaServiceId(
                reserva.getFechaReserva(),
                reserva.getHoraReserva(),
                reserva.getSpaService().getId()
        );

        if (existe) {
            throw new RuntimeException("Ya existe una reserva para este servicio en la misma fecha y hora");
        }

        reserva.setEstado("PENDIENTE");
        return reservaRepository.save(reserva);
    }

    // 🟣 Listar todas las reservas
    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    // 🔵 Listar reservas por usuario
    public List<Reserva> listarPorUsuario(Long usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId);
    }

    // 🟡 Listar reservas por estado
    public List<Reserva> listarPorEstado(String estado) {
        return reservaRepository.findByEstado(estado);
    }

    // 🔶 Buscar reserva por ID
    public Optional<Reserva> buscarPorId(Long id) {
        return reservaRepository.findById(id);
    }

    // 🟠 Actualizar estado de una reserva (ej. CONFIRMADA, CANCELADA)
    public Reserva actualizarEstado(Long id, String nuevoEstado) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        reserva.setEstado(nuevoEstado);
        return reservaRepository.save(reserva);
    }

    // 🔴 Eliminar una reserva
    public void eliminarReserva(Long id) {
        reservaRepository.deleteById(id);
    }
}
