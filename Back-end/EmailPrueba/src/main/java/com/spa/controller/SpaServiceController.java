package com.spa.controller;

import com.spa.model.SpaService;
import com.spa.service.SpaServiceService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/spa-services")
@CrossOrigin(origins = "*")
public class SpaServiceController {

    private final SpaServiceService spaServiceService;

    public SpaServiceController(SpaServiceService spaServiceService) {
        this.spaServiceService = spaServiceService;
    }

    @GetMapping
    public List<SpaService> getAll() {
        return spaServiceService.findAll();
    }

    @GetMapping("/category/{categoryId}")
    public List<SpaService> getByCategory(@PathVariable Long categoryId) {
        return spaServiceService.findByCategory(categoryId);
    }

    @PostMapping
    public SpaService create(@RequestBody SpaService spaService) {
        return spaServiceService.create(spaService);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        spaServiceService.delete(id);
    }
}
