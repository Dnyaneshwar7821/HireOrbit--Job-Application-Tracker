package com.hireorbit.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hireorbit.dto.AuthResponse;
import com.hireorbit.dto.LoginRequest;
import com.hireorbit.entity.User;
import com.hireorbit.repository.UserRepository;
import com.hireorbit.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:5173")
public class AuthController {

	@Autowired
	private AuthService authService;

	@Autowired
	private UserRepository userRepository;

	@PostMapping("/register")
	public AuthResponse register(@RequestBody User user) {
		return authService.register(user);
	}

	@PostMapping("/login")
	public AuthResponse login(@RequestBody LoginRequest request) {
		return authService.login(request);
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getProfile(Authentication authentication) {

		if (authentication == null || authentication.getName() == null) {
			return ResponseEntity.status(401).body("Unauthorized");
		}

		String email = authentication.getName();

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return ResponseEntity.ok(Map.of("name", user.getName(), "email", user.getEmail(), "role", user.getRole()));
	}
}