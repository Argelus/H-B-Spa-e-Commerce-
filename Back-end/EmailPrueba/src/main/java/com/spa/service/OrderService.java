package com.spa.service;

import com.spa.model.Order;
import com.spa.model.CartItem;
import com.spa.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.math.BigDecimal;


@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // 🟢 Crear una nueva orden
    public Order crearOrden(Order order) {
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            for (CartItem item : order.getItems()) {
                item.setOrder(order);
                item.calculateTotal(); // Calcula total individualmente
            }
            order.calcularTotal(); // Calcula total global
        } else {
            order.setTotal(BigDecimal.ZERO);
        }

        return orderRepository.save(order);
    }


    // 🔵 Obtener todas las órdenes
    public List<Order> listarTodas() {
        return orderRepository.findAll();
    }

    // 🟣 Obtener órdenes por usuario
    public List<Order> listarPorUsuario(Long usuarioId) {
        return orderRepository.findByUsuarioId(usuarioId);
    }

    // 🟡 Obtener órdenes por estado
    public List<Order> listarPorEstado(String estado) {
        return orderRepository.findByEstado(estado);
    }

    // 🟠 Actualizar estado de una orden
    public Order actualizarEstado(Long id, String nuevoEstado) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        order.setEstado(nuevoEstado);
        return orderRepository.save(order);
    }

    // 🔴 Eliminar una orden
    public void eliminarOrden(Long id) {
        orderRepository.deleteById(id);
    }
}
