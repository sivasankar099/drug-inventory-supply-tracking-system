package com.pharma.drug_inventory.controller;

import com.pharma.drug_inventory.entity.Drug;
import com.pharma.drug_inventory.service.DrugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drugs")
@CrossOrigin(origins = "*")
public class DrugController {

    @Autowired
    private DrugService drugService;

    @GetMapping
    public ResponseEntity<List<Drug>> getAllDrugs() {
        return ResponseEntity.ok(drugService.getAllDrugs());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Drug>> getActiveDrugs() {
        return ResponseEntity.ok(drugService.getActiveDrugs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Drug> getDrugById(@PathVariable Long id) {
        return ResponseEntity.ok(drugService.getDrugById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Drug>> getDrugsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(drugService.getDrugsByCategory(categoryId));
    }

    @PostMapping
    public ResponseEntity<Drug> createDrug(@RequestBody Drug drug) {
        return ResponseEntity.ok(drugService.createDrug(drug));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Drug> updateDrug(
            @PathVariable Long id,
            @RequestBody Drug drug) {
        return ResponseEntity.ok(drugService.updateDrug(id, drug));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDrug(@PathVariable Long id) {
        drugService.deleteDrug(id);
        return ResponseEntity.ok("Drug deleted successfully!");
    }
}