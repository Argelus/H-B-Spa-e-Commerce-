package com.spa.controller;

import com.spa.model.Order;
import com.spa.security.model.Usuario;
import com.spa.service.OrderService;
import com.spa.service.UsuarioService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final UsuarioService usuarioService; // 👈 NUEVO: para resolver el usuario desde el token

    public OrderController(OrderService orderService, UsuarioService usuarioService) {
        this.orderService = orderService;
        this.usuarioService = usuarioService; // 👈 inyectado
    }

    // 🟢 Crear una nueva orden (requiere token)
    @PostMapping
    public Order crearOrden(@RequestBody Order order) {
        return orderService.crearOrden(order);
    }

    // 🔵 Obtener todas las órdenes (solo admin)
    @GetMapping
    public List<Order> listarTodas() {
        return orderService.listarTodas();
    }

    // 🟣 Obtener órdenes de un usuario específico (por ID)
    @GetMapping("/usuario/{usuarioId}")
    public List<Order> listarPorUsuario(@PathVariable Long usuarioId) {
        return orderService.listarPorUsuario(usuarioId);
    }

    // ✅ NUEVO: Obtener órdenes del usuario autenticado (por token)
    @GetMapping("/mine")
    public List<Order> listarMias(org.springframework.security.core.Authentication auth) {
        Usuario u = usuarioService.buscarPorUsername(auth.getName());
        return orderService.listarPorUsuario(u.getId());
    }

    // 🟡 Filtrar por estado
    @GetMapping("/estado/{estado}")
    public List<Order> listarPorEstado(@PathVariable String estado) {
        return orderService.listarPorEstado(estado);
    }

    // 🟠 Actualizar estado (solo admin)
    @PutMapping("/{id}/estado")
    public Order actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        return orderService.actualizarEstado(id, estado);
    }

    // 🔴 Eliminar orden (solo admin)
    @DeleteMapping("/{id}")
    public void eliminarOrden(@PathVariable Long id) {
        orderService.eliminarOrden(id);
    }
}
