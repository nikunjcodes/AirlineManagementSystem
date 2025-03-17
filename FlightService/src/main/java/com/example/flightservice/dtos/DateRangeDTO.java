package com.example.flightservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DateRangeDTO {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
