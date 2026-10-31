package com.hireorbit.controller;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

	@GetMapping("/")
	public Map<String, Object> home() {
		Map<String, Object> response = new LinkedHashMap<>();
		response.put("status", "UP");
		response.put("service", "HireOrbit Backend API");
		response.put("version", "2.0.0");
		response.put("timestamp", Instant.now().toString());
		response.put("docs", "Use /api/auth or /api/jobs for public API routes");
		response.put("frontendUrl", "https://hire-orbit-job-application-tracker.vercel.app");
		return response;
	}
}
