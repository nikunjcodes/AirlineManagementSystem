package com.example.ticketservice.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlightDTO {
    private Long id;
    @NotBlank(message = "Flight number is required")
    private String flightNumber;
    @NotBlank(message = "Airline name is required")
    private String airlineName;
    @NotBlank(message = "Departure city is required")
    private String departureCity;
    @NotBlank(message = "Arrival city is required")
    private String arrivalCity;
    @NotNull(message = "Price is required")
    private Integer price;
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity should be greater than 0")
    private Integer capacity;
    private Integer availableSeats;
}
