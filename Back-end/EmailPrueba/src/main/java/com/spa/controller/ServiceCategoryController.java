package com.spa.controller;

import com.spa.model.ServiceCategory;
import com.spa.service.ServiceCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-categories")
@CrossOrigin(origins = "*")
public class ServiceCategoryController {

    private final ServiceCategoryService serviceCategoryService;

    public ServiceCategoryController(ServiceCategoryService serviceCategoryService) {
        this.serviceCategoryService = serviceCategoryService;
    }

    // 🟢 Crear una nueva categoría
    @PostMapping
    public ResponseEntity<ServiceCategory> create(@RequestBody ServiceCategory category) {
        ServiceCategory nuevaCategoria = serviceCategoryService.create(category);
        return ResponseEntity.ok(nuevaCategoria);
    }

    // 🔵 Listar todas las categorías
    @GetMapping
    public ResponseEntity<List<ServiceCategory>> findAll() {
        List<ServiceCategory> categorias = serviceCategoryService.findAll();
        return ResponseEntity.ok(categorias);
    }

    // 🟣 Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<ServiceCategory> findById(@PathVariable Long id) {
        return serviceCategoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🟠 Actualizar una categoría existente
    @PutMapping("/{id}")
    public ResponseEntity<ServiceCategory> update(@PathVariable Long id, @RequestBody ServiceCategory category) {
        ServiceCategory actualizada = serviceCategoryService.update(id, category);
        return ResponseEntity.ok(actualizada);
    }

    // 🔴 Eliminar una categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceCategoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
