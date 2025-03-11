package com.example.userservice.dtos;

import lombok.Data;
import lombok.Getter;

import java.util.Set;
@Getter
@Data
public class RegisterRequest {
    private String username;
    private String email;
    private Set<String> role;
    private String password;

}
