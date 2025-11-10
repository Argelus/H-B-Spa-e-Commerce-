package com.spa.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.spa.security.model.Usuario;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Usuario que realizó la orden (compra).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnoreProperties({
            "password", "email", "authorities", "enabled",
            "accountNonLocked", "accountNonExpired", "credentialsNonExpired", "role"
    })
    private Usuario usuario;

    /**
     * Lista de productos comprados (relación 1-a-muchos con CartItem).
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<CartItem> items = new ArrayList<>();

    /**
     * Total de la compra (suma de todos los ítems).
     */
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal total = BigDecimal.ZERO;

    /**
     * Estado de la orden: PENDIENTE, PAGADA, ENVIADA, CANCELADA.
     */
    @Column(length = 50, nullable = false)
    private String estado = "PENDIENTE";

    /**
     * Fecha y hora en la que se generó la orden.
     */
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    /**
     * Nota opcional del cliente o interna del sistema.
     */
    @Column(length = 500)
    private String nota;

    // Métodos auxiliares
    public void calcularTotal() {
        if (items == null || items.isEmpty()) {
            this.total = BigDecimal.ZERO;
            return;
        }

        this.total = items.stream()
                .map(item -> item.getTotalPrice() != null ? item.getTotalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @PrePersist
    @PreUpdate
    private void preGuardar() {
        if (items != null) {
            items.forEach(item -> item.setOrder(this));
        }
        calcularTotal();
    }
}
