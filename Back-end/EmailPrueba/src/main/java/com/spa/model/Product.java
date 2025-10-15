// 📦 Paquete donde se encuentra esta clase
package com.spa.model;

// 🔽 Importaciones necesarias
import jakarta.persistence.*; // Librería JPA para trabajar con bases de datos
import java.math.BigDecimal; // Tipo más preciso que double para precios

// 🧱 Marca esta clase como una "Entidad"
// Esto significa que representa una tabla en la base de datos
@Entity

// 🏷️ Define el nombre de la tabla (opcional, si no se pone, usa el nombre de la clase)
@Table(name = "products")
public class Product {

    // 🆔 Llave primaria (ID único de cada producto)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Se genera automáticamente en la BD
    private Long id;

    // 🏷️ Nombre del producto
    @Column(nullable = false, length = 100)
    private String name;

    // 💲 Precio del producto
    @Column(nullable = false)
    private BigDecimal price;

    // 🧾 Descripción opcional
    @Column(length = 255)
    private String description;

    // 📦 Stock disponible
    @Column(nullable = false)
    private int stock;

    // -------------------------------------------------------------------
    // 🧱 CONSTRUCTORES
    // -------------------------------------------------------------------

    // Constructor vacío (requerido por JPA)
    public Product() {
    }

    // Constructor con parámetros (útil para pruebas o crear productos manualmente)
    public Product(String name, BigDecimal price, String description, int stock) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.stock = stock;
    }

    // -------------------------------------------------------------------
    // ⚙️ GETTERS Y SETTERS
    // -------------------------------------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}
