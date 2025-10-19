// 📦 Paquete donde se encuentra esta clase
package com.spa.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private Integer stock;

    // ⚗️ Contenido del producto (ej. "250 ml", "100 mg", etc.)
    @Column(length = 50)
    private String contenido;

    // 🏷️ Relación con Categoría
    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;

    // 🖼️ URL de la imagen del producto
    @Column(length = 500)
    private String imageUrl;

    // Constructor vacío (requerido por JPA)
    public Product() {}

    // Constructor con todos los parámetros
    public Product(String name, BigDecimal price, String description, Integer stock, String imageUrl, String contenido) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.contenido = contenido;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
