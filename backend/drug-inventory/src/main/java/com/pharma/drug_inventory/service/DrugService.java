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

    public List<Drug> getAllDrugs() {
        return drugRepository.findAll();
    }

    public List<Drug> getActiveDrugs() {
        return drugRepository.findByIsActiveTrue();
    }

    public Drug getDrugById(Long id) {
        return drugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drug not found"));
    }

    public Drug createDrug(Drug drug) {
        return drugRepository.save(drug);
    }

    public Drug updateDrug(Long id, Drug drugDetails) {
        Drug drug = getDrugById(id);
        drug.setName(drugDetails.getName());
        drug.setDescription(drugDetails.getDescription());
        drug.setManufacturer(drugDetails.getManufacturer());
        drug.setUnitPrice(drugDetails.getUnitPrice());
        drug.setCategory(drugDetails.getCategory());
        drug.setIsActive(drugDetails.getIsActive());
        return drugRepository.save(drug);
    }

    public void deleteDrug(Long id) {
        drugRepository.deleteById(id);
    }
}