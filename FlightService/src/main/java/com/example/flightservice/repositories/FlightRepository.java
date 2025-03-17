package com.example.flightservice.repositories;

import com.example.flightservice.models.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight , Long> {
    Optional<Flight> findByFlightNumber(String flightNumber);
    Optional<Flight> findByFlightId(Long flightId);
    @Query("SELECT f FROM Flight f order by f.price ASC")
    List<Flight> findAllByOrderByPriceAsc();
    @Query("SELECT f FROM Flight f order by f.price DESC")
    List<Flight> findAllByOrderByPriceDesc();
}
