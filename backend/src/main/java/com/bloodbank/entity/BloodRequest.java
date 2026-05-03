package com.bloodbank.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "blood_requests")
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User requester;

    private String bloodGroup;
    private String bloodComponentType;
    private Integer quantityUnits;
    private String status;
    private String urgency;

    private LocalDateTime requestDate;
}