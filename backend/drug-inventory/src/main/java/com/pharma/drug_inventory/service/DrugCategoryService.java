package com.pharma.drug_inventory.service;

import com.pharma.drug_inventory.entity.DrugCategory;
import com.pharma.drug_inventory.repository.DrugCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DrugCategoryService {

    @Autowired
    private DrugCategoryRepository drugCategoryRepository;

    public List<DrugCategory> getAllCategories() {
        return drugCategoryRepository.findAll();
    }

    public DrugCategory getCategoryById(Long id) {
        return drugCategoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    public DrugCategory createCategory(DrugCategory category) {
        if (drugCategoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category already exists: " + category.getName());
        }
        return drugCategoryRepository.save(category);
    }

    public DrugCategory updateCategory(Long id, DrugCategory category) {
        DrugCategory existing = getCategoryById(id);
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        return drugCategoryRepository.save(existing);
    }

    public void deleteCategory(Long id) {
        DrugCategory existing = getCategoryById(id);
        drugCategoryRepository.delete(existing);
    }
}