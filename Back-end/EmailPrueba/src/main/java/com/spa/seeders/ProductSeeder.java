//Paquete donde estará el seeder
package com.spa.seeders;

import com.spa.model.Product;
import com.spa.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

//@Component
public class ProductSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public ProductSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {

            System.out.println("Cargando productos iniciales en la base de datos...");

//            Product p1 = new Product(
//                    "Masaje Relajante",
//                    new BigDecimal("499.99"),
//                    "Masaje corporal completo con aceites esenciales.",
//                    10,
//                    "https://res.cloudinary.com/demo/image/upload/v1729011111/masaje_relajante.jpg"
//            );
//
//            Product p2 = new Product(
//                    "Facial Hidratante",
//                    new BigDecimal("399.99"),
//                    "Tratamiento facial con mascarilla nutritiva.",
//                    8,
//                    "https://res.cloudinary.com/demo/image/upload/v1729011122/facial_hidratante.jpg"
//            );
//
//            Product p3 = new Product(
//                    "Aromaterapia Deluxe",
//                    new BigDecimal("599.99"),
//                    "Sesión de relajación con aceites esenciales premium.",
//                    5,
//                    "https://res.cloudinary.com/demo/image/upload/v1729011133/aromaterapia_deluxe.jpg"
//            );
//
//            Product p4 = new Product(
//                    "Limpieza Profunda",
//                    new BigDecimal("299.99"),
//                    "Limpieza facial profunda con exfoliación natural.",
//                    12,
//                    "https://res.cloudinary.com/demo/image/upload/v1729011144/limpieza_profunda.jpg"
//            );
//
//            Product p5 = new Product(
//                    "Masaje de Piedras Calientes",
//                    new BigDecimal("699.99"),
//                    "Masaje terapéutico con piedras volcánicas.",
//                    6,
//                    "https://res.cloudinary.com/demo/image/upload/v1729011155/piedras_calientes.jpg"
//            );

//            productRepository.save(p1);
//            productRepository.save(p2);
//            productRepository.save(p3);
//            productRepository.save(p4);
//            productRepository.save(p5);

            System.out.println("Productos iniciales insertados correctamente.");
        } else {
            System.out.println("Productos ya existentes, no se inserta nada nuevo.");
        }
    }
}
