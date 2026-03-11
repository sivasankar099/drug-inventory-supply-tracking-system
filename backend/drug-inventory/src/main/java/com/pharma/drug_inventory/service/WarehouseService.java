package com.pharma.drug_inventory.service;

import com.pharma.drug_inventory.entity.Warehouse;
import com.pharma.drug_inventory.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WarehouseService {

    @Autowired
    private WarehouseRepository warehouseRepository;

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public List<Warehouse> getActiveWarehouses() {
        return warehouseRepository.findByIsActiveTrue();
    }

    public Warehouse getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + id));
    }

    public Warehouse createWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(Long id, Warehouse warehouse) {
        Warehouse existing = getWarehouseById(id);
        existing.setName(warehouse.getName());
        existing.setLocation(warehouse.getLocation());
        return warehouseRepository.save(existing);
    }

    public void deleteWarehouse(Long id) {
        Warehouse existing = getWarehouseById(id);
        existing.setIsActive(false);
        warehouseRepository.save(existing);
    }
}