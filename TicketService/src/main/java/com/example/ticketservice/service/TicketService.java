package com.example.ticketservice.service;

import com.example.ticketservice.dtos.TicketDTO;
import com.example.ticketservice.model.Ticket;

import java.util.List;

public interface TicketService {
    TicketDTO createTicket(TicketDTO ticketDTO);
    TicketDTO getTicketById(Long id);
    List<TicketDTO> getTicketsByUserId(Long userId);
    void cancelTicket(Long id);
    List<TicketDTO> getAllTickets();
}
