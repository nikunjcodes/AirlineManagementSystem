package com.example.ticketservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String jwt = extractJwtFromRequest(request);
            log.debug("Extracted JWT token: {}", jwt != null ? "present" : "null");

            if (StringUtils.hasText(jwt)) {
                try {
                    Long userId = jwtUtil.extractUserId(jwt);
                    String role = jwtUtil.extractRole(jwt);
                    log.debug("Extracted userId: {}, role: {}", userId, role);

                    if (userId != null && StringUtils.hasText(role)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        log.debug("Authentication set in SecurityContext for user: {}", userId);
                    }
                } catch (Exception e) {
                    log.error("Could not authenticate user: {}", e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Could not process JWT token: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 