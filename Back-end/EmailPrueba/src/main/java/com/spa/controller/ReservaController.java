package com.spa.controller;

import com.spa.model.Reserva;
import com.spa.security.model.Usuario;
import com.spa.service.ReservaService;
import com.spa.service.UsuarioService;
import com.spa.service.WhatsappService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    private final ReservaService reservaService;
    private final WhatsappService whatsappService;
    private final UsuarioService usuarioService; // 👈 NUEVO: para resolver el usuario por token

    public ReservaController(ReservaService reservaService,
                             WhatsappService whatsappService,
                             UsuarioService usuarioService) { // 👈 inyectamos también UsuarioService
        this.reservaService = reservaService;
        this.whatsappService = whatsappService;
        this.usuarioService = usuarioService;
    }

    // 🟢 Crear una nueva reserva
    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody Reserva reserva) {
        if (reserva.getSpaService() == null || reserva.getSpaService().getId() == null) {
            throw new IllegalArgumentException("Debe especificarse un servicio válido (spaService.id)");
        }
        if (reserva.getUsuario() == null || reserva.getUsuario().getId() == null) {
            throw new IllegalArgumentException("Debe especificarse el usuario que realiza la reserva (usuario.id)");
        }

        Reserva nuevaReserva = reservaService.crearReserva(reserva);

        // 📲 Enviar mensaje de confirmación por WhatsApp
        String mensaje = String.format(
                "Hola %s, tu cita en H&B Spa para %s el %s a las %s ha sido registrada correctamente. " +
                        "Una asesora del spa te contactará para confirmar tu cita. " +
                        "Gracias por tu preferencia.",
                reserva.getUsuario().getUsername(),
                reserva.getSpaService().getName(),
                reserva.getFechaReserva(),
                reserva.getHoraReserva()
        );

        whatsappService.enviarMensaje(reserva.getTelefono(), mensaje);

        return ResponseEntity.ok(nuevaReserva);
    }

    // 🔵 Obtener todas las reservas
    @GetMapping
    public ResponseEntity<List<Reserva>> listarTodas() {
        return ResponseEntity.ok(reservaService.listarTodas());
    }

    // 🟣 Obtener reservas por usuario (por ID explícito)
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.listarPorUsuario(usuarioId));
    }

    // ✅ NUEVO: Obtener reservas del usuario autenticado (por token)
    @GetMapping("/mias")
    public ResponseEntity<List<Reserva>> listarMias(org.springframework.security.core.Authentication auth) {
        Usuario u = usuarioService.buscarPorUsername(auth.getName());
        return ResponseEntity.ok(reservaService.listarPorUsuario(u.getId()));
    }

    // 🟡 Obtener reservas por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Reserva>> listarPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(reservaService.listarPorEstado(estado));
    }

    // 🟠 Actualizar estado de una reserva
    @PutMapping("/{id}/estado")
    public ResponseEntity<Reserva> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(reservaService.actualizarEstado(id, estado));
    }

    // 🔴 Eliminar una reserva
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReserva(@PathVariable Long id) {
        reservaService.eliminarReserva(id);
        return ResponseEntity.noContent().build();
    }
}
