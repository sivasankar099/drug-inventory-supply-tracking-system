package com.pharma.drug_inventory.repository;

import com.pharma.drug_inventory.entity.DrugCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DrugCategoryRepository extends JpaRepository<DrugCategory, Long> {
    Boolean existsByName(String name);
}