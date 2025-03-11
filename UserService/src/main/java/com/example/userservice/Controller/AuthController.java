package com.example.userservice.Controller;

import com.example.userservice.dtos.LoginRequest;
import com.example.userservice.dtos.RegisterRequest;
import com.example.userservice.models.User;
import com.example.userservice.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Getter
@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @PostMapping("/public/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest){
        System.out.print("Register Request: " + registerRequest);
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setRole("ROLE_USER");
        userService.registerUser(user);
        return ResponseEntity.ok("User created successfully!!");

    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/public/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        System.out.println("Login request"+ loginRequest.getUsername() + loginRequest.getPassword());
        return ResponseEntity.ok(userService.authenticateUser(loginRequest));
    }
}
