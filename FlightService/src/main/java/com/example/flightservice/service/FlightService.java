package com.example.flightservice.service;

import com.example.flightservice.dtos.FlightDTO;
import com.example.flightservice.models.Flight;
import com.example.flightservice.repositories.FlightRepository;
import lombok.AllArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class FlightService {
    private final FlightRepository flightRepository;
    public List<FlightDTO> getAllFlights(String sort) {
        List<Flight> flights;
        if (sort.equals("asc")) {
            flights = flightRepository.findAllByOrderByPriceAsc();
        } else if (sort.equals("desc")) {
            flights = flightRepository.findAllByOrderByPriceDesc();
        } else {
            flights = flightRepository.findAll();
        }
        return flights.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public FlightDTO getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with flight id: " + id));
        return convertToDTO(flight);
    }
    public FlightDTO getFlightByFlightNumber(String flightNumber) {
        Flight flight = flightRepository.findByFlightNumber(flightNumber)
                .orElseThrow(() -> new RuntimeException("Flight not found with flight number: " + flightNumber));
        return convertToDTO(flight);
    }
    public FlightDTO createFlight(FlightDTO flightDTO){
        if(flightRepository.findByFlightNumber(flightDTO.getFlightNumber()).isPresent()){
            throw new DuplicateKeyException("Flight already exists with flight number: " + flightDTO.getFlightNumber());
        }
        flightDTO.setAvailableSeats(flightDTO.getCapacity());
        Flight flight = convertToEntity(flightDTO);
        Flight savedFlight = flightRepository.save(flight);
        return convertToDTO(savedFlight);
    }
    private Flight convertToEntity(FlightDTO flightDTO){
        Flight flight = new Flight();
        flight.setFlightNumber(flightDTO.getFlightNumber());
        flight.setAirlineName(flightDTO.getAirlineName());
        flight.setCapacity(flightDTO.getCapacity());
        flight.setAvailableSeats(flightDTO.getAvailableSeats());
        flight.setArrivalCity(flightDTO.getArrivalCity());
        flight.setDepartureCity(flightDTO.getDepartureCity());
        flight.setPrice(flightDTO.getPrice());

        return flight;
    }

    private FlightDTO convertToDTO(Flight flight){
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.setId(flight.getId());
        flightDTO.setFlightNumber(flight.getFlightNumber());
        flightDTO.setAirlineName(flight.getAirlineName());
        flightDTO.setCapacity(flight.getCapacity());
        flightDTO.setAvailableSeats(flight.getAvailableSeats());
        flightDTO.setArrivalCity(flight.getArrivalCity());
        flightDTO.setDepartureCity(flight.getDepartureCity());
        flightDTO.setPrice(flight.getPrice());
        return flightDTO;

    }
    public void deleteFlight(Long id){
        if(!flightRepository.existsById(id)){
            throw new RuntimeException("Flight not found with flight id: " + id);
        }
        flightRepository.deleteById(id);
    }
    public FlightDTO updateFlight(Long id, FlightDTO flightDTO){
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with flight id: " + id));
        if(!flight.getFlightNumber().equals(flightDTO.getFlightNumber()) && flightRepository.findByFlightNumber(flightDTO.getFlightNumber()).isPresent()){
            throw new DuplicateKeyException("Flight already exists with flight number: " + flightDTO.getFlightNumber());
        }
        flight.setFlightNumber(flightDTO.getFlightNumber());
        flight.setAirlineName(flightDTO.getAirlineName());
        flight.setArrivalCity(flightDTO.getArrivalCity());
        flight.setDepartureCity(flightDTO.getDepartureCity());
        flight.setPrice(flightDTO.getPrice());
        if(flightDTO.getCapacity() < flight.getCapacity() - flight.getAvailableSeats())
            throw new RuntimeException("Capacity cannot be reduced as there are already booked seats");
        int bookedSeats = flight.getCapacity() - flight.getAvailableSeats();
        flight.setCapacity(flightDTO.getCapacity());
        flight.setAvailableSeats(flightDTO.getCapacity() - bookedSeats);
        Flight savedFlight = flightRepository.save(flight);
        return convertToDTO(savedFlight);
    }
}
