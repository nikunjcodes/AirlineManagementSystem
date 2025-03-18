package com.example.ticketservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long flightId;
    private Long scheduleId;
    private String passengerName;
    private String seatNumber;
    private Double price;
    private TicketStatus status;
    private LocalDateTime bookingTime;
    private LocalDateTime lastUpdated;
}
public enum TicketStatus{
    BOOKED,
    CANCELLED,
    COMPLETED
}
