package com.healthplatform.service;

import com.healthplatform.dto.LabTrendDTO;
import com.healthplatform.model.LabParameter;
import com.healthplatform.model.ParameterName;
import com.healthplatform.repository.LabParameterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrendService {

    private final LabParameterRepository labParameterRepository;

    public List<LabTrendDTO> getParameterTrends(Long patientId, String parameterNameStr) {
        ParameterName paramName;
        try {
            paramName = ParameterName.valueOf(parameterNameStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid parameter name: " + parameterNameStr);
        }

        List<LabParameter> parameters = labParameterRepository
                .findByPatientIdAndParameterNameOrderByTestDateAsc(patientId, paramName);

        return parameters.stream()
                .map(p -> new LabTrendDTO(
                        p.getTestDate(),
                        p.getValue(),
                        p.getUnit(),
                        p.getReport().getId()
                ))
                .collect(Collectors.toList());
    }
}
