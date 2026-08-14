package com.hireorbit.service;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hireorbit.dto.AuthResponse;
import com.hireorbit.dto.LoginRequest;
import com.hireorbit.entity.User;
import com.hireorbit.exception.ResourceNotFoundException;
import com.hireorbit.repository.UserRepository;
import com.hireorbit.util.JwtUtil;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostConstruct
	public void initAdminUser() {
		try {
			if (!userRepository.existsByEmail("admin@hireorbit.com")) {
				User admin = new User();
				admin.setName("HireOrbit Admin");
				admin.setEmail("admin@hireorbit.com");
				admin.setPassword(passwordEncoder.encode("Admin@123"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
			}
		} catch (Exception ignored) {
		}
	}

	public AuthResponse register(User user) {
		if (user.getPassword() == null || user.getPassword().isBlank()) {
			throw new RuntimeException("Password is required");
		}

		if (userRepository.existsByEmail(user.getEmail())) {
			throw new RuntimeException("Email already registered");
		}

		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user.setRole("USER");

		userRepository.save(user);

		String token = jwtUtil.generateToken(user.getEmail(), "USER");
		return new AuthResponse(token, "Registered successfully");
	}

	public AuthResponse login(LoginRequest request) {

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new RuntimeException("Invalid credentials");
		}

		String role = user.getRole() != null ? user.getRole() : "USER";
		String token = jwtUtil.generateToken(user.getEmail(), role);
		return new AuthResponse(token, "Login successful");
	}

	public AuthResponse adminLogin(LoginRequest request) {

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourceNotFoundException("Admin account not found"));

		if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
			throw new RuntimeException("Access denied: Account is not an Administrator");
		}

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new RuntimeException("Invalid admin credentials");
		}

		String token = jwtUtil.generateToken(user.getEmail(), "ADMIN");
		return new AuthResponse(token, "Admin login successful");
	}
}
