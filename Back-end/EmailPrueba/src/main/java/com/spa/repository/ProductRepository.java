// Paquete donde se encuentra este repositorio
package com.spa.repository;

// Importamos lo necesario
import com.spa.model.Product; // Nuestra entidad de producto
import org.springframework.data.jpa.repository.JpaRepository; // Repositorio base de Spring JPA
import org.springframework.stereotype.Repository; // Marca la clase como componente tipo "repositorio"

// Anotación que indica que esta interfaz es un "repositorio" de acceso a datos
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // No necesitamos escribir código aquí.
    // Spring Data JPA crea automáticamente todos los métodos básicos:
    //
    // - save(Product product) → guarda o actualiza un producto
    // - findById(Long id) → busca un producto por su ID
    // - findAll() → devuelve todos los productos
    // - deleteById(Long id) → elimina un producto
    //
    // También puedes crear consultas personalizadas si lo necesitas, por ejemplo:
    // List<Product> findByNameContaining(String keyword);
}
