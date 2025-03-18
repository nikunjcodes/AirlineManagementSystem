package com.example.ticketservice.service;

import com.example.ticketservice.dtos.FlightDTO;
import com.example.ticketservice.dtos.ScheduleDTO;
import com.example.ticketservice.dtos.TicketDTO;
import com.example.ticketservice.dtos.UserDTO;
import com.example.ticketservice.model.Ticket;
import com.example.ticketservice.model.TicketStatus;
import com.example.ticketservice.repository.TicketRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@EnableAutoConfiguration
@AllArgsConstructor
public class TicketServiceImpl implements TicketService{

    private TicketRepository ticketRepository;
    private RestTemplate restTemplate;
    @Value("${flight.service.url}")
    private String flightServiceUrl;
    @Value("${user.service.url}")
    private String userServiceUrl;
    @Override
    @Transactional
    public TicketDTO createTicket(TicketDTO ticketDTO) {

        FlightDTO flightDTO = restTemplate.getForObject(
                flightServiceUrl + "/flights/" + ticketDTO.getFlightId(),
                FlightDTO.class
        );
        if(flightDTO == null){
            throw new IllegalArgumentException("Flight not found");
        }
        ScheduleDTO scheduleDTO = restTemplate.getForObject(
                flightServiceUrl+"/flights/schedules/"+ticketDTO.getScheduleId(),
                ScheduleDTO.class
        );
        if(scheduleDTO==null)
            throw new IllegalArgumentException("Schedule not found");

        Ticket ticket = new Ticket();
        ticket.setUserId(ticketDTO.getUserId());
        ticket.setFlightId(ticketDTO.getFlightId());
        ticket.setScheduleId(ticketDTO.getScheduleId());
        ticket.setPassengerName(ticketDTO.getPassengerName());
        ticket.setPrice(ticketDTO.getPrice());
        ticket.setStatus(TicketStatus.BOOKED);
        ticket.setBookingTime(LocalDateTime.now());
        ticket.setLastUpdated(LocalDateTime.now());
        ticket = ticketRepository.save(ticket);
        return enrichTicketDTO(convertToDTO(ticket));

    }

    @Override
    public TicketDTO getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("Ticket not found for "));
        return enrichTicketDTO(convertToDTO(ticket));
    }

    @Override
    public List<TicketDTO> getTicketsByUserId(Long userId) {
        return ticketRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .map(this::enrichTicketDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("Ticket not found"));
        if(ticket.getStatus()==TicketStatus.CANCELLED){
            throw new IllegalArgumentException("Ticket is already cancelled");

        }
        ticket.setStatus(TicketStatus.CANCELLED);
        ticket.setLastUpdated(LocalDateTime.now());
        ticketRepository.save(ticket);
    }

    @Override
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::convertToDTO)
                .map(this::enrichTicketDTO)
                .collect(Collectors.toList());
    }
    private TicketDTO convertToDTO(Ticket ticket){
        TicketDTO ticketDTO = new TicketDTO();
        ticketDTO.setId(ticket.getId());
        ticketDTO.setUserId(ticket.getUserId());
        ticketDTO.setFlightId(ticket.getFlightId());
        ticketDTO.setScheduleId(ticket.getScheduleId());
        ticketDTO.setPassengerName(ticket.getPassengerName());
        ticketDTO.setPrice(ticket.getPrice());
        ticketDTO.setStatus(ticket.getStatus().name());
        ticketDTO.setBookingTime(ticket.getBookingTime());
        ticketDTO.setLastUpdated(ticket.getLastUpdated());
        return ticketDTO;
    }
    private TicketDTO enrichTicketDTO(TicketDTO ticketDTO){
        try{
            ticketDTO.setFlight(restTemplate.getForObject(
                    flightServiceUrl+"/flights/"+ticketDTO.getFlightId(),
                    FlightDTO.class
            ));
            ticketDTO.setSchedule(restTemplate.getForObject(
                    flightServiceUrl+"flights/schedules/"+ticketDTO.getScheduleId(),
                    ScheduleDTO.class
            ));
            ticketDTO.setUser(restTemplate.getForObject(
                    userServiceUrl+"/users/"+ticketDTO.getUserId(),
                    UserDTO.class
            ));
        }
        catch (Exception e){
            System.err.println("Error while enriching ticket DTO \n "+e.getMessage());
        }
        return ticketDTO;
    }
}
