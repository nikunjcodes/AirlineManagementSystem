package com.example.flightservice.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "schedules")
@AllArgsConstructor
@NoArgsConstructor
public class Schedule{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    @Enumerated(EnumType.STRING)
    private FlightStatus flightStatus;
}
