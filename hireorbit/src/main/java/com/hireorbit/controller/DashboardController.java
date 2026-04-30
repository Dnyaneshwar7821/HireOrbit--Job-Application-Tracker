package com.hireorbit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hireorbit.dto.ApplicationStatsDTO;
import com.hireorbit.entity.User;
import com.hireorbit.repository.UserRepository;
import com.hireorbit.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin("http://localhost:5173")
public class DashboardController {

	@Autowired
	private DashboardService dashboardService;

	@Autowired
	private UserRepository userRepository;

	// ✅ FIXED → remove userId
	@GetMapping("/stats")
	public ApplicationStatsDTO getStats(Authentication authentication) {

		String email = authentication.getName();

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return dashboardService.getStats(user.getId());
	}
}