package com.example.flightservice.controller;

import com.example.flightservice.dtos.ScheduleDTO;
import com.example.flightservice.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/flight")
@AllArgsConstructor
public class ScheduleController {
    private final ScheduleService scheduleService;
    @GetMapping("/{flightId}/schedules")
    public ResponseEntity<List<ScheduleDTO>> getScheduleByFlight(
            @PathVariable Long flightId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate endDate
            ){
        if (startDate != null && endDate == null) {
            endDate = startDate;
        } else if (startDate == null && endDate != null) {
            startDate = endDate;
        }
        List<ScheduleDTO> scheduleDTOS = scheduleService.getScheduleByFlightId(flightId , startDate , endDate);
        return ResponseEntity.ok(scheduleDTOS);
    }
    @GetMapping("/schedules")
    public ResponseEntity<ScheduleDTO> getScheduleById(@PathVariable Long id ){
        ScheduleDTO scheduleDTO = scheduleService.getScheduleById(id);
        return ResponseEntity.ok(scheduleDTO);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/schedules")
    public ResponseEntity<ScheduleDTO> createSchedule(@Valid @RequestBody ScheduleDTO scheduleDTO) {
        ScheduleDTO createdSchedule = scheduleService.createSchedule(scheduleDTO);
        return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/schedules/{id}")
    public ResponseEntity<ScheduleDTO> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleDTO scheduleDTO) {
        ScheduleDTO updatedSchedule = scheduleService.updateSchedule(id, scheduleDTO);
        return ResponseEntity.ok(updatedSchedule);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
