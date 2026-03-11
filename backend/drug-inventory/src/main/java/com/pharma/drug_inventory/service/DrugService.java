package com.pharma.drug_inventory.service;

import com.pharma.drug_inventory.entity.Drug;
import com.pharma.drug_inventory.repository.DrugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DrugService {

    @Autowired
    private DrugRepository drugRepository;

    @Autowired
    private DrugCategoryService drugCategoryService;

    public List<Drug> getAllDrugs() {
        return drugRepository.findAll();
    }

    public List<Drug> getActiveDrugs() {
        return drugRepository.findByIsActiveTrue();
    }

    public List<Drug> getDrugsByCategory(Long categoryId) {
        return drugRepository.findByCategoryId(categoryId);
    }

    public Drug getDrugById(Long id) {
        return drugRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Drug not found with id: " + id));
    }

    public Drug createDrug(Drug drug) {
        if (drugRepository.existsByName(drug.getName())) {
            throw new RuntimeException("Drug already exists: " + drug.getName());
        }
        drugCategoryService.getCategoryById(drug.getCategory().getId());
        return drugRepository.save(drug);
    }

    public Drug updateDrug(Long id, Drug drug) {
        Drug existing = getDrugById(id);
        existing.setName(drug.getName());
        existing.setGenericName(drug.getGenericName());
        existing.setManufacturer(drug.getManufacturer());
        existing.setDosageForm(drug.getDosageForm());
        existing.setStrength(drug.getStrength());
        existing.setUnit(drug.getUnit());
        existing.setHsnCode(drug.getHsnCode());
        existing.setCategory(drug.getCategory());
        return drugRepository.save(existing);
    }

    public void deleteDrug(Long id) {
        Drug existing = getDrugById(id);
        existing.setIsActive(false);
        drugRepository.save(existing);
    }
}