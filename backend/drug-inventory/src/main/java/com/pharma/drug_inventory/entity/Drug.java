package com.pharma.drug_inventory.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "drugs")
public class Drug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "generic_name", length = 150)
    private String genericName;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private DrugCategory category;

    @Column(length = 150)
    private String manufacturer;

    @Column(name = "dosage_form", length = 50)
    private String dosageForm;

    @Column(length = 50)
    private String strength;

    @Column(length = 20)
    private String unit;

    @Column(name = "hsn_code", length = 20)
    private String hsnCode;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(length = 500)
    private String description;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}