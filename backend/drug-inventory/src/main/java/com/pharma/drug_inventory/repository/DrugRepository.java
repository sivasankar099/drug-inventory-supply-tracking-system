package com.pharma.drug_inventory.repository;

import com.pharma.drug_inventory.entity.Drug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DrugRepository extends JpaRepository<Drug, Long> {
    List<Drug> findByIsActiveTrue();
    List<Drug> findByCategoryId(Long categoryId);
    Boolean existsByName(String name);
}