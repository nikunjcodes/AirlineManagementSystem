package com.example.ticketservice.repository;

import com.example.ticketservice.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket , Long> {
    List<Ticket> findByUserId(Long userId);
    List<Ticket> findByScheduleId(Long scheduleId);

    List<Ticket> findByFlightId(Long flightId);

}
