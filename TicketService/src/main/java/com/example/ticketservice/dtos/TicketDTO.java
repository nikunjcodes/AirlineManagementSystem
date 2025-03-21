package com.example.ticketservice.dtos;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDTO {
    private Long id;
    @NotNull(message = "User id is required")
    private Long userId;
    @NotNull(message =  "Schedule id is required")
    private Long scheduleId;
    @NotNull(message = "Flight id is required")
    private Long flightId;
    @NotNull(message = "Passenger name is required")
    private String passengerName;
    private String seatNumber;
    private Double price;
    private String status;
    private LocalDateTime bookingTime;
    private LocalDateTime lastUpdated;

    private FlightDTO flight;
    private ScheduleDTO schedule;
    private UserDTO user;
}
