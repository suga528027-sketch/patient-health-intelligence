package com.healthplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimelineItemDTO {
    private Long id;
    private LocalDateTime date;
    private String type; // e.g. "REPORT"
    private String title;
    private String description;
    private Long reportId;
}
