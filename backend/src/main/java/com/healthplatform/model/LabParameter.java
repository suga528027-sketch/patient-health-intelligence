package com.healthplatform.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_parameters", indexes = {
    @Index(name = "idx_lab_parameters_patient_param_date", columnList = "patient_id, parameter_name, test_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LabParameter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private MedicalReport report;

    @Enumerated(EnumType.STRING)
    @Column(name = "parameter_name", nullable = false)
    private ParameterName parameterName;

    @Column(name = "value", nullable = false)
    private Double value;

    @Column(name = "unit", nullable = false)
    private String unit;

    @Column(name = "reference_range")
    private String referenceRange;

    @Column(name = "test_date", nullable = false)
    private LocalDateTime testDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
