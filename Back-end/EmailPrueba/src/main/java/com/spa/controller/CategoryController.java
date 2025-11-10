package com.spa.controller;

import com.spa.model.Category;
import com.spa.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ✅ Import necesario
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // ------------------------------------------------------------------
    // Crear nueva categoría (solo ADMIN)
    // ------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')") // Solo los administradores pueden crear
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.saveCategory(category));
    }

    // ------------------------------------------------------------------
    //  Obtener todas las categorías (público)
    // ------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // ------------------------------------------------------------------
    // Obtener una categoría por su ID (público)
    // ------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ------------------------------------------------------------------
    // Eliminar una categoría (solo ADMIN)
    // ------------------------------------------------------------------
    @PreAuthorize("hasRole('ADMIN')") //  Solo ADMIN puede eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
