package com.hireorbit.service;

import java.time.LocalDate;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hireorbit.dto.AuthResponse;
import com.hireorbit.dto.LoginRequest;
import com.hireorbit.entity.JobPosting;
import com.hireorbit.entity.User;
import com.hireorbit.exception.ResourceNotFoundException;
import com.hireorbit.repository.JobPostingRepository;
import com.hireorbit.repository.UserRepository;
import com.hireorbit.util.JwtUtil;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JobPostingRepository jobPostingRepository;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostConstruct
	public void initAdminUser() {
		try {
			User admin;
			if (!userRepository.existsByEmail("admin@hireorbit.com")) {
				admin = new User();
				admin.setName("HireOrbit Admin");
				admin.setEmail("admin@hireorbit.com");
				admin.setPassword(passwordEncoder.encode("Admin@123"));
				admin.setRole("ADMIN");
				admin = userRepository.save(admin);
			} else {
				admin = userRepository.findByEmail("admin@hireorbit.com").orElse(null);
			}

			if (admin != null && jobPostingRepository.count() == 0) {
				JobPosting job1 = new JobPosting();
				job1.setTitle("Senior Full Stack Developer");
				job1.setCompany("CloudScale Solutions");
				job1.setLocation("Remote (US / Global)");
				job1.setEmploymentType("Full-time");
				job1.setSalaryRange("$130,000 - $160,000");
				job1.setDepartment("Engineering");
				job1.setDescription("We are seeking an experienced Full Stack Developer to lead our next-generation web platforms. You will architect high-scalability frontend apps in React and design resilient backend microservices in Spring Boot.");
				job1.setRequiredSkills("React, TypeScript, Java, Spring Boot, MySQL, REST APIs, Docker, CI/CD");
				job1.setStatus("ACTIVE");
				job1.setPostedDate(LocalDate.now());
				job1.setPostedBy(admin);
				jobPostingRepository.save(job1);

				JobPosting job2 = new JobPosting();
				job2.setTitle("Backend Engineer (Java & Microservices)");
				job2.setCompany("FinTech Innovations");
				job2.setLocation("New York, NY / Hybrid");
				job2.setEmploymentType("Full-time");
				job2.setSalaryRange("$140,000 - $175,000");
				job2.setDepartment("Platform Core");
				job2.setDescription("Join our core platform engineering team building low-latency payment processing pipelines. You will optimize database transactions, enforce Spring Security protocols, and build event-driven services.");
				job2.setRequiredSkills("Java 17, Spring Boot, Spring Security, JPA, MySQL, Redis, Kafka, System Design");
				job2.setStatus("ACTIVE");
				job2.setPostedDate(LocalDate.now());
				job2.setPostedBy(admin);
				jobPostingRepository.save(job2);

				JobPosting job3 = new JobPosting();
				job3.setTitle("DevOps & Cloud Infrastructure Engineer");
				job3.setCompany("NextGen AI Labs");
				job3.setLocation("San Francisco, CA / Remote");
				job3.setEmploymentType("Full-time");
				job3.setSalaryRange("$150,000 - $185,000");
				job3.setDepartment("DevOps");
				job3.setDescription("We are looking for a DevOps Engineer to manage our automated CI/CD pipelines, container orchestration with Docker/Kubernetes, and cloud deployment monitoring.");
				job3.setRequiredSkills("Docker, Kubernetes, AWS, GCP, CI/CD, Terraform, Linux, Prometheus");
				job3.setStatus("ACTIVE");
				job3.setPostedDate(LocalDate.now());
				job3.setPostedBy(admin);
				jobPostingRepository.save(job3);
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
