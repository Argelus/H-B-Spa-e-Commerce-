package com.spa.controller;

import com.spa.model.Order;
import com.spa.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
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

    // 🟣 Obtener órdenes de un usuario específico
    @GetMapping("/usuario/{usuarioId}")
    public List<Order> listarPorUsuario(@PathVariable Long usuarioId) {
        return orderService.listarPorUsuario(usuarioId);
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
