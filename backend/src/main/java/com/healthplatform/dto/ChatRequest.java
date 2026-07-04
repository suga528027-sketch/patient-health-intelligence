package com.healthplatform.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    private Long patientId;
}
