package com.spa.service;

import com.spa.model.ServiceCategory;
import com.spa.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceCategoryService {

    private final ServiceCategoryRepository repository;

    public ServiceCategoryService(ServiceCategoryRepository repository) {
        this.repository = repository;
    }

    public ServiceCategory create(ServiceCategory category) {
        return repository.save(category);
    }

    public List<ServiceCategory> findAll() {
        return repository.findAll();
    }

    public Optional<ServiceCategory> findById(Long id) {
        return repository.findById(id);
    }

    public ServiceCategory update(Long id, ServiceCategory category) {
        ServiceCategory existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        existing.setImageUrl(category.getImageUrl());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
