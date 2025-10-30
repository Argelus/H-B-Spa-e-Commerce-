package com.spa.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Producto al que pertenece este ítem.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({
            "description", "stock", "imageUrl", "category"
    })
    private Product product;

    /**
     * Cantidad de unidades del producto.
     */
    @Column(nullable = false)
    private int quantity;

    /**
     * Precio total (cantidad × precio unitario del producto).
     */
    @Column(name = "total_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    /**
     * Relación con la orden a la que pertenece el ítem.
     * Muchas líneas (items) pueden pertenecer a una misma orden.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    // 🔹 Método auxiliar para calcular el total automático
    public void calculateTotal() {
        if (product != null && product.getPrice() != null) {
            this.totalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        } else {
            this.totalPrice = BigDecimal.ZERO;
        }
    }

    @PrePersist
    @PreUpdate
    private void preSave() {
        calculateTotal();
    }
}
