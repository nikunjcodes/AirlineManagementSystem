package com.example.flightservice.controller;

import com.example.flightservice.dtos.FlightDTO;
import com.example.flightservice.service.FlightService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flights")
@AllArgsConstructor

public class FlightController {
    private final FlightService flightService;
    @GetMapping
    public ResponseEntity<List<FlightDTO>> getAllFlights(
            @RequestParam(required = false) String sort){
        if(sort==null)
            sort = "asc";
        List<FlightDTO> getAllFlights = flightService.getAllFlights(sort);
        return ResponseEntity.ok(getAllFlights);
    }
    @GetMapping("/{id}")
    public ResponseEntity<FlightDTO> getFlightById(@PathVariable Long id){
        FlightDTO flightDTO = flightService.getFlightById(id);
        return ResponseEntity.ok(flightDTO);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<FlightDTO> updateFlight(
            @PathVariable Long id,
            @Valid @RequestBody FlightDTO flightDTO
    ){
        FlightDTO updatedFlight = flightService.updateFlight(id, flightDTO);
        return ResponseEntity.ok(updatedFlight);
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FlightDTO> createFlight(
            @Valid @RequestBody FlightDTO flightDTO
    ){
        FlightDTO createdFlight = flightService.createFlight(flightDTO);
        return ResponseEntity.ok(createdFlight);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id){
        flightService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }

}
