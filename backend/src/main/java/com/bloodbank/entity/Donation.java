package com.bloodbank.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User donor;

    private LocalDate donationDate;
    private String bloodGroup;
    private String bloodComponentType;
    private Integer quantityMl;
    private Integer units;
    private LocalDate nextEligibleDate;
}