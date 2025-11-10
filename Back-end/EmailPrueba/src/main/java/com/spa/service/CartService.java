package com.spa.service;

import com.spa.model.CartItem;
import com.spa.model.Product;
import com.spa.repository.CartRepository;
import com.spa.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    // Inyección por constructor
    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    // Obtener todos los ítems del carrito
    public List<CartItem> getAllItems() {
        return cartRepository.findAll();
    }

    // Agregar producto al carrito
    public CartItem addItem(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Verificar si ya existe el producto en el carrito
        CartItem existingItem = cartRepository.findAll().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Si ya existe, solo se actualiza la cantidad
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.calculateTotal();
            return cartRepository.save(existingItem);
        }

        // Si no existe, se crea uno nuevo
        CartItem newItem = new CartItem();
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        newItem.calculateTotal();
        return cartRepository.save(newItem);
    }

    // Actualizar cantidad de un producto específico
    public CartItem updateQuantity(Long id, int quantity) {
        CartItem item = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Elemento no encontrado"));

        item.setQuantity(quantity);
        item.calculateTotal();
        return cartRepository.save(item);
    }

    // Eliminar un ítem del carrito
    public void removeItem(Long id) {
        if (!cartRepository.existsById(id)) {
            throw new RuntimeException("El elemento no existe en el carrito");
        }
        cartRepository.deleteById(id);
    }

    // Vaciar carrito
    public void clearCart() {
        cartRepository.deleteAll();
    }

    // Calcular total del carrito
    public BigDecimal calculateTotal() {
        return cartRepository.findAll().stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
