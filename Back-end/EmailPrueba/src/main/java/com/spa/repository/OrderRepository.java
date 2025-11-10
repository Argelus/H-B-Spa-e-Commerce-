package com.spa.repository;

import com.spa.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    //  Buscar órdenes por usuario
    List<Order> findByUsuarioId(Long usuarioId);

    // Buscar órdenes por estado
    List<Order> findByEstado(String estado);
}
