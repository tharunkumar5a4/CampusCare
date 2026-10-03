package com.campuscare.controller;

import com.campuscare.dto.ApiResponse;
import com.campuscare.dto.AuthResponse;
import com.campuscare.dto.LoginRequest;
import com.campuscare.dto.RegisterRequest;
import com.campuscare.security.UserPrincipal;
import com.campuscare.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        AuthResponse response = new AuthResponse(
                null,
                userPrincipal.getUser().getId(),
                userPrincipal.getUser().getName(),
                userPrincipal.getUser().getEmail(),
                userPrincipal.getUser().getRole(),
                userPrincipal.getUser().getPhone()
        );
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", response));
    }
}
