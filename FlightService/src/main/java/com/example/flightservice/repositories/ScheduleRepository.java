package com.example.flightservice.repositories;

import com.example.flightservice.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule , Long> {
    List<Schedule> findByFlightId(Long flightId);
    @Query("SELECT s FROM Schedule s WHERE s.flight.id = :flightId AND s.departureTime>=: startDate AND s.departureTime<=: endDate")
    List<Schedule> findByFlightIdAndDepartureTimeBetween(
            @Param("flightId") Long flightId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
