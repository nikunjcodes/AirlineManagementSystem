package com.example.flightservice.service;

import com.example.flightservice.dtos.ScheduleDTO;
import com.example.flightservice.models.Flight;
import com.example.flightservice.models.FlightStatus;
import com.example.flightservice.models.Schedule;
import com.example.flightservice.repositories.FlightRepository;
import com.example.flightservice.repositories.ScheduleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@AllArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final FlightService flightService;
    private final FlightRepository flightRepository;
    public List<ScheduleDTO> getScheduleByFlightId(Long flightId , LocalDate startDate , LocalDate endDate) {
        if(!flightRepository.existsById(flightId)){
            throw new RuntimeException("Flight not found with flight id: " + flightId);
        }
        List<Schedule> schedules;
        if(startDate !=null && endDate !=null){
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
            if(startDateTime.isAfter(endDateTime)){
                throw new RuntimeException("Start date should be before end date");
            }
            schedules = scheduleRepository.findByFlightIdAndDepartureTimeBetween(flightId , startDateTime , endDateTime);
        }
        else{
            schedules = scheduleRepository.findByFlightId(flightId);
        }
        return schedules.stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }
    public ScheduleDTO getScheduleById(Long id){
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
        return convertToDTO(schedule);
    }
    public ScheduleDTO createSchedule(ScheduleDTO scheduleDTO){
        Flight flight = flightRepository.findById(scheduleDTO.getId())
                .orElseThrow(() -> new RuntimeException("Flight not found with flight id: " + scheduleDTO.getId()));
        if(scheduleDTO.getDepartureTime().isAfter(scheduleDTO.getArrivalTime())){
            throw new RuntimeException("Departure time should be before arrival time");
        }
        if(scheduleDTO.getFlightStatus()==null)
            scheduleDTO.setFlightStatus(FlightStatus.SCHEDULED);
        Schedule schedule = convertToEntity(scheduleDTO);
        schedule.setFlight(flight);
        return convertToDTO(scheduleRepository.save(schedule));
    }
    public ScheduleDTO updateSchedule(Long id, ScheduleDTO scheduleDTO) {
        Schedule existingSchedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found with id: " + id));
        if (!existingSchedule.getFlight().getId().equals(scheduleDTO.getFlightId())) {
            Flight flight = flightRepository.findById(scheduleDTO.getFlightId())
                    .orElseThrow(() -> new IllegalArgumentException("Flight not found with id: " + scheduleDTO.getFlightId()));
            existingSchedule.setFlight(flight);
        }

        if (scheduleDTO.getDepartureTime().isAfter(scheduleDTO.getArrivalTime())) {
            throw new IllegalArgumentException("Departure time must be before arrival time");
        }
        existingSchedule.setDepartureTime(scheduleDTO.getDepartureTime());
        existingSchedule.setArrivalTime(scheduleDTO.getArrivalTime());
        existingSchedule.setFlightStatus(scheduleDTO.getFlightStatus());

        Schedule updatedSchedule = scheduleRepository.save(existingSchedule);
        return convertToDTO(updatedSchedule);
    }
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new IllegalArgumentException("Schedule not found with id: " + id);
        }
        scheduleRepository.deleteById(id);
    }
    private ScheduleDTO convertToDTO(Schedule schedule){
        ScheduleDTO scheduleDTO = new ScheduleDTO();
        scheduleDTO.setId(schedule.getId());
        scheduleDTO.setFlightId(schedule.getFlight().getId());
        scheduleDTO.setDepartureTime(schedule.getDepartureTime());
        scheduleDTO.setArrivalTime(schedule.getArrivalTime());
        scheduleDTO.setFlightStatus(schedule.getFlightStatus());
        scheduleDTO.setFlightDTO(flightService.getFlightById(schedule.getFlight().getId()));

        return scheduleDTO;
    }
    private Schedule convertToEntity(ScheduleDTO scheduleDTO){
        Schedule schedule = new Schedule();
        schedule.setId(scheduleDTO.getId());
        schedule.setDepartureTime(scheduleDTO.getDepartureTime());
        schedule.setArrivalTime(scheduleDTO.getArrivalTime());
        schedule.setFlightStatus(scheduleDTO.getFlightStatus());
        return schedule;
    }
}

