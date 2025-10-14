// 📦 Paquete donde se encuentra el controlador
package com.spa.controller;

// 🔽 Importaciones necesarias
import com.spa.model.Product;
import com.spa.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// 🧠 Indica que esta clase es un controlador REST (maneja peticiones HTTP)
@RestController

// 📍 Define la ruta base para acceder a los endpoints de productos
// Ejemplo: http://localhost:8080/api/products
@RequestMapping("/api/products")
public class ProductController {

    // 🧩 Inyecta el servicio de productos para usar su lógica
    @Autowired
    private ProductService productService;

    // ------------------------------------------------------------------
    // ➕ 1️⃣ Crear un nuevo producto
    // ------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    // ------------------------------------------------------------------
    // 📋 2️⃣ Obtener todos los productos
    // ------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // ------------------------------------------------------------------
    // 🔍 3️⃣ Obtener un producto por su ID
    // ------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ------------------------------------------------------------------
    // ✏️ 4️⃣ Actualizar un producto existente
    // ------------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Optional<Product> updated = productService.updateProduct(id, updatedProduct);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ------------------------------------------------------------------
    // 🗑️ 5️⃣ Eliminar un producto
    // ------------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
