// 📦 Paquete principal del servicio
package com.spa.service;

// 🔽 Importaciones necesarias
import com.spa.model.Product;
import com.spa.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// 🧠 Marca esta clase como un servicio administrado por Spring
@Service
public class ProductService {

    // 📚 Repositorio que permite acceder a la base de datos
    private final ProductRepository productRepository;

    // 🧱 Constructor para la inyección de dependencias (Spring lo hace automáticamente)
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ------------------------------------------------------------------
    // ➕ 1️⃣ Crear o actualizar un producto
    // ------------------------------------------------------------------
    public Product saveProduct(Product product) {
        // Si ya existe, lo actualiza; si no, lo crea nuevo
        return productRepository.save(product);
    }

    // ------------------------------------------------------------------
    // 📋 2️⃣ Obtener todos los productos
    // ------------------------------------------------------------------
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ------------------------------------------------------------------
    // 🔍 3️⃣ Buscar un producto por su ID
    // ------------------------------------------------------------------
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // ------------------------------------------------------------------
    // ✏️ 4️⃣ Actualizar un producto existente
    // ------------------------------------------------------------------
    public Optional<Product> updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(existingProduct -> {

            // ✅ Solo actualiza si se envía un valor nuevo
            if (updatedProduct.getName() != null)
                existingProduct.setName(updatedProduct.getName());

            if (updatedProduct.getPrice() != null)
                existingProduct.setPrice(updatedProduct.getPrice());

            if (updatedProduct.getDescription() != null)
                existingProduct.setDescription(updatedProduct.getDescription());

            if (updatedProduct.getStock() != null)
                existingProduct.setStock(updatedProduct.getStock());

            if (updatedProduct.getContenido() != null)
                existingProduct.setContenido(updatedProduct.getContenido());

            if (updatedProduct.getImageUrl() != null)
                existingProduct.setImageUrl(updatedProduct.getImageUrl());

            if (updatedProduct.getCategory() != null)
                existingProduct.setCategory(updatedProduct.getCategory());

            return productRepository.save(existingProduct);
        });
    }


    // ------------------------------------------------------------------
    // 🗑️ 5️⃣ Eliminar un producto por su ID
    // ------------------------------------------------------------------
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
