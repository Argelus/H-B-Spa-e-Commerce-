package com.spa.service;

import com.spa.model.SpaService;
import com.spa.repository.SpaServiceRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SpaServiceService {

    private final SpaServiceRepository spaServiceRepository;

    public SpaServiceService(SpaServiceRepository spaServiceRepository) {
        this.spaServiceRepository = spaServiceRepository;
    }

    public SpaService create(SpaService spaService) {
        return spaServiceRepository.save(spaService);
    }

    public List<SpaService> findAll() {
        return spaServiceRepository.findAll();
    }

    public List<SpaService> findByCategory(Long categoryId) {
        return spaServiceRepository.findByCategoryId(categoryId);
    }

    public Optional<SpaService> findById(Long id) {
        return spaServiceRepository.findById(id);
    }

    public void delete(Long id) {
        spaServiceRepository.deleteById(id);
    }
}
