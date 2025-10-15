package com.spa.service;

import com.spa.model.CartItem;
import com.spa.model.Product;
import com.spa.repository.CartRepository;
import com.spa.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItem> getAllItems() {
        return cartRepository.findAll();
    }

    public CartItem addItem(Long productId, int quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);

        if (productOpt.isEmpty()) {
            throw new RuntimeException("Producto no encontrado");
        }

        Product product = productOpt.get();

        CartItem item = new CartItem(product, quantity);
        return cartRepository.save(item);
    }

    public CartItem updateQuantity(Long id, int quantity) {
        CartItem item = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Elemento no encontrado"));

        item.setQuantity(quantity);
        item.setTotalPrice(item.getProduct().getPrice().multiply(BigDecimal.valueOf(quantity)));

        return cartRepository.save(item);
    }

    public void removeItem(Long id) {
        cartRepository.deleteById(id);
    }

    public void clearCart() {
        cartRepository.deleteAll();
    }

    public BigDecimal calculateTotal() {
        return cartRepository.findAll()
                .stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

