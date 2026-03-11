package com.pharma.drug_inventory.service;

import com.pharma.drug_inventory.entity.Supplier;
import com.pharma.drug_inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public List<Supplier> getActiveSuppliers() {
        return supplierRepository.findByIsActiveTrue();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    public Supplier createSupplier(Supplier supplier) {
        if (supplierRepository.existsByEmail(supplier.getEmail())) {
            throw new RuntimeException("Supplier already exists with email: " + supplier.getEmail());
        }
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier supplier) {
        Supplier existing = getSupplierById(id);
        existing.setName(supplier.getName());
        existing.setContactName(supplier.getContactName());
        existing.setEmail(supplier.getEmail());
        existing.setPhone(supplier.getPhone());
        existing.setAddress(supplier.getAddress());
        existing.setGstNumber(supplier.getGstNumber());
        return supplierRepository.save(existing);
    }

    public void deleteSupplier(Long id) {
        Supplier existing = getSupplierById(id);
        existing.setIsActive(false);
        supplierRepository.save(existing);
    }
}