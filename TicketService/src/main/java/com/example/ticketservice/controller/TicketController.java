package com.example.ticketservice.controller;

import com.example.ticketservice.dtos.TicketDTO;
import com.example.ticketservice.model.ApiResponse;
import com.example.ticketservice.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (Long) authentication.getPrincipal();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TicketDTO>> createTicket(@Valid @RequestBody TicketDTO ticketDTO) {
        try {
            // Set the authenticated user's ID
            ticketDTO.setUserId(getCurrentUserId());
            TicketDTO createdTicket = ticketService.createTicket(ticketDTO);
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Ticket created successfully", createdTicket));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketDTO>> getTicket(@PathVariable Long id) {
        try {
            TicketDTO ticket = ticketService.getTicketById(id);
            // Verify ticket ownership
            if (!ticket.getUserId().equals(getCurrentUserId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse<>("ERROR", "Access denied: You can only view your own tickets", null));
            }
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Ticket retrieved successfully", ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelTicket(@PathVariable Long id) {
        try {
            TicketDTO ticket = ticketService.getTicketById(id);
            // Verify ticket ownership
            if (!ticket.getUserId().equals(getCurrentUserId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse<>("ERROR", "Access denied: You can only cancel your own tickets", null));
            }
            ticketService.cancelTicket(id);
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Ticket cancelled successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<ApiResponse<List<TicketDTO>>> getMyTickets() {
        try {
            List<TicketDTO> tickets = ticketService.getTicketsByUserId(getCurrentUserId());
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Tickets retrieved successfully", tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TicketDTO>>> getAllTickets() {
        try {
            List<TicketDTO> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "All tickets retrieved successfully", tickets));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("ERROR", e.getMessage(), null));
        }
    }
}
