package com.example.ticketservice.dtos;

import com.example.ticketservice.model.FlightStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO {
    private Long id;
    @NotNull(message = "Flight id is required")
    private Long flightId;
    @NotNull(message = "Departure time is required")
    @Future(message = "Departure time should be in future")
    private LocalDateTime departureTime;

    @NotNull(message = "Arrival time is required")
    @Future(message = "Arrival time should be in future")
    private LocalDateTime arrivalTime;
    private FlightStatus flightStatus;
    private FlightDTO flightDTO;
}
