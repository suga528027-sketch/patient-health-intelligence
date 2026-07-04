package com.healthplatform.repository;

import com.healthplatform.model.LabParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabParameterRepository extends JpaRepository<LabParameter, Long> {
    List<LabParameter> findByPatientId(Long patientId);
    List<LabParameter> findByReportId(Long reportId);
    List<LabParameter> findByPatientIdAndParameterNameOrderByTestDateAsc(Long patientId, com.healthplatform.model.ParameterName parameterName);
}
