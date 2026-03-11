package com.pharma.drug_inventory.service;

import com.pharma.drug_inventory.entity.Inventory;
import com.pharma.drug_inventory.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public List<Inventory> getInventoryByWarehouse(Long warehouseId) {
        return inventoryRepository.findByWarehouseId(warehouseId);
    }

    public List<Inventory> getInventoryByDrug(Long drugId) {
        return inventoryRepository.findByDrugId(drugId);
    }

    public List<Inventory> getExpiringDrugs() {
        LocalDate thirtyDaysLater = LocalDate.now().plusDays(30);
        return inventoryRepository.findByExpiryDateBefore(thirtyDaysLater);
    }

    public List<Inventory> getLowStockItems() {
        return inventoryRepository
            .findByQuantityLessThanEqualAndQuantityGreaterThan(10, 0);
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
    }

    public Inventory addInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Long id, Inventory inventory) {
        Inventory existing = getInventoryById(id);
        existing.setQuantity(inventory.getQuantity());
        existing.setMinQuantity(inventory.getMinQuantity());
        existing.setExpiryDate(inventory.getExpiryDate());
        existing.setPurchasePrice(inventory.getPurchasePrice());
        existing.setSellingPrice(inventory.getSellingPrice());
        existing.setBatchNumber(inventory.getBatchNumber());
        return inventoryRepository.save(existing);
    }
}