package com.example.ticketservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import com.example.ticketservice.dtos.UserDTO;

import java.security.Key;
import java.util.Base64;
import java.util.function.Function;

@RequiredArgsConstructor
@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${user.service.url}")
    private String userServiceUrl;

    private final RestTemplate restTemplate;



    private Key getSigningKey() {
        if (!StringUtils.hasText(secret)) {
            throw new IllegalStateException("JWT secret is not configured");
        }
        try {
            byte[] keyBytes = Base64.getDecoder().decode(secret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException e) {
            log.error("Error decoding JWT secret: {}", e.getMessage());
            throw new IllegalStateException("Invalid JWT secret configuration", e);
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        try {
            // First try to get the username from the token
            String username = extractUsername(token);
            if (!StringUtils.hasText(username)) {
                throw new JwtException("No username found in token");
            }

            log.debug("Extracted username from token: {}", username);

            // Call UserService to get the user details
            try {
                ResponseEntity<UserDTO> response = restTemplate.getForEntity(
                    userServiceUrl + "/api/users/username/" + username,
                    UserDTO.class
                );

                if (response.getBody() != null && response.getBody().getId() != null) {
                    log.debug("Found user ID: {} for username: {}", response.getBody().getId(), username);
                    return response.getBody().getId();
                }
            } catch (Exception e) {
                log.error("Error fetching user details from UserService: {}", e.getMessage());
            }

            throw new JwtException("Could not determine user ID");
        } catch (Exception e) {
            log.error("Error extracting user ID: {}", e.getMessage());
            throw new JwtException("Error extracting user ID", e);
        }
    }

    public String extractRole(String token) {
        try {
            Claims claims = extractAllClaims(token);
            
            // Try to get role from authorities claim
            Object authoritiesObj = claims.get("authorities");
            if (authoritiesObj != null) {
                String authorities = authoritiesObj.toString();
                if (authorities.contains("ROLE_")) {
                    return authorities.replace("ROLE_", "");
                }
                return authorities;
            }
            
            // Default to USER role if no role found
            return "USER";
        } catch (Exception e) {
            log.error("Error extracting role: {}", e.getMessage());
            return "USER"; // Default to USER role on error
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        if (!StringUtils.hasText(token)) {
            throw new JwtException("Token cannot be null or empty");
        }
        
        try {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        } catch (Exception e) {
            log.error("Error extracting claim: {}", e.getMessage());
            throw new JwtException("Error processing token", e);
        }
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.error("Error parsing JWT token: {}", e.getMessage());
            throw new JwtException("Error parsing JWT token", e);
        }
    }
}