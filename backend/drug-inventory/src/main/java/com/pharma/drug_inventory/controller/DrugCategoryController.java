package com.pharma.drug_inventory.controller;

import com.pharma.drug_inventory.entity.DrugCategory;
import com.pharma.drug_inventory.service.DrugCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class DrugCategoryController {

    @Autowired
    private DrugCategoryService drugCategoryService;

    @GetMapping
    public ResponseEntity<List<DrugCategory>> getAllCategories() {
        return ResponseEntity.ok(drugCategoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DrugCategory> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(drugCategoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<DrugCategory> createCategory(@RequestBody DrugCategory category) {
        return ResponseEntity.ok(drugCategoryService.createCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DrugCategory> updateCategory(
            @PathVariable Long id,
            @RequestBody DrugCategory category) {
        return ResponseEntity.ok(drugCategoryService.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        drugCategoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully!");
    }
}