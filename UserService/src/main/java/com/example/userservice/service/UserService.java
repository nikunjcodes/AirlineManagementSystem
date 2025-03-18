package com.example.userservice.service;

import com.example.userservice.dtos.LoginRequest;
import com.example.userservice.models.User;
import com.example.userservice.Repository.UserRepository;
import com.example.userservice.security.JwtAuthenticationResponse;
import com.example.userservice.security.JwtUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Getter
@Service
@AllArgsConstructor
public class UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtils jwtUtils;

    public User registerUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public void setJwtUtils(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        try {
            System.out.println("🔹 Authenticating user: " + loginRequest.getUsername());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("✅ Authentication successful for: " + userDetails.getUsername());

            // Generate JWT Token
            String jwt = jwtUtils.generateToken(userDetails);
            System.out.println("🟢 Generated JWT: " + jwt);

            return new JwtAuthenticationResponse(jwt);
        } catch (Exception e) {
            System.err.println("❌ Authentication failed: " + e.getMessage());
            throw new RuntimeException("Invalid credentials. Please check username and password.");
        }
    }

    public User findByUserName(String name){
        return userRepository.findByUsername(name)
                .orElseThrow(()-> new UsernameNotFoundException("User not found with username: "+name));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }
}