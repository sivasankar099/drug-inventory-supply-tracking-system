package com.pharma.drug_inventory.repository;

import com.pharma.drug_inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByWarehouseId(Long warehouseId);
    List<Inventory> findByDrugId(Long drugId);
    List<Inventory> findByExpiryDateBefore(LocalDate date);
    List<Inventory> findByQuantityLessThanEqualAndQuantityGreaterThan(
        Integer minQty, Integer zero);
}