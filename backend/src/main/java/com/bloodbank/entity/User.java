package com.bloodbank.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity @Data @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String role;
    private boolean isGovtOfficer;

    @Column(unique = true)
    private String email;

    @Column(name = "government_id")
    private String governmentId;

    @Column(name = "government_id_type")
    private String governmentIdType;

    private String resetToken;
    private java.time.LocalDateTime tokenExpiry;
    private int resetAttempts;
    private java.time.LocalDateTime lastResetAttempt;

    private java.time.LocalDate lastDonationDate;


    private String bloodGroup;
    private Double bmi;
    private Double haemoglobin;
    private String medicalHistory;
    private boolean isEmergencyDonor;
    private String empId;
}