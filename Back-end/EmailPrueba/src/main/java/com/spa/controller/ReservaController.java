package com.spa.controller;

import com.spa.model.Reserva;
import com.spa.security.model.Usuario;
import com.spa.service.ReservaService;
import com.spa.service.UsuarioService;
import com.spa.service.WhatsappService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    private final ReservaService reservaService;
    private final WhatsappService whatsappService;
    private final UsuarioService usuarioService;

    public ReservaController(ReservaService reservaService,
                             WhatsappService whatsappService,
                             UsuarioService usuarioService) {
        this.reservaService = reservaService;
        this.whatsappService = whatsappService;
        this.usuarioService = usuarioService;
    }

    // Crear una nueva reserva: EL USUARIO VIENE DEL TOKEN
    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody Reserva reserva, Authentication auth) {
        if (reserva.getSpaService() == null || reserva.getSpaService().getId() == null) {
            throw new IllegalArgumentException("Debe especificarse un servicio válido (spaService.id)");
        }

        // 1) Resolver usuario autenticado por username (del JWT)
        Usuario u = usuarioService.buscarPorUsername(auth.getName());
        reserva.setUsuario(u); //  ignoramos cualquier 'usuario' que venga en el body

        // 2) Crear reserva
        Reserva nuevaReserva = reservaService.crearReserva(reserva);

        // 3) (Opcional) Mensaje por WhatsApp
        try {
            String mensaje = String.format(
                    "Hola %s, tu cita en H&B Spa para %s el %s a las %s ha sido registrada correctamente. " +
                            "Una asesora del spa te contactará para confirmar tu cita. Gracias por tu preferencia.",
                    u.getUsername(),
                    nuevaReserva.getSpaService().getName(),
                    nuevaReserva.getFechaReserva(),
                    nuevaReserva.getHoraReserva()
            );
            if (nuevaReserva.getTelefono() != null && !nuevaReserva.getTelefono().isBlank()) {
                whatsappService.enviarMensaje(nuevaReserva.getTelefono(), mensaje);
            }
        } catch (Exception ignored) {}

        return ResponseEntity.ok(nuevaReserva);
    }

    // Todas (según permisos en SecurityConfig)
    @GetMapping
    public ResponseEntity<List<Reserva>> listarTodas() {
        return ResponseEntity.ok(reservaService.listarTodas());
    }

    // Por usuario (ID explícito)
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.listarPorUsuario(usuarioId));
    }

    // Mis reservas (usuario autenticado)
    @GetMapping("/mias")
    public ResponseEntity<List<Reserva>> listarMias(Authentication auth) {
        Usuario u = usuarioService.buscarPorUsername(auth.getName());
        return ResponseEntity.ok(reservaService.listarPorUsuario(u.getId()));
    }

    // Por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Reserva>> listarPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(reservaService.listarPorEstado(estado));
    }

    // Actualizar estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<Reserva> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(reservaService.actualizarEstado(id, estado));
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReserva(@PathVariable Long id) {
        reservaService.eliminarReserva(id);
        return ResponseEntity.noContent().build();
    }
}
