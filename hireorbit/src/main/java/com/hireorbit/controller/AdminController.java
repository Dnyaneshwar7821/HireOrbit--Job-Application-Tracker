package com.hireorbit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hireorbit.dto.AdminStatsDTO;
import com.hireorbit.dto.UserSummaryDTO;
import com.hireorbit.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	@Autowired
	private AdminService adminService;

	@GetMapping("/stats")
	public AdminStatsDTO getStats() {
		return adminService.getPlatformStats();
	}

	@GetMapping("/users")
	public List<UserSummaryDTO> getUsers() {
		return adminService.getAllUsers();
	}

	@PutMapping("/users/{id}/role")
	public UserSummaryDTO updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
		String role = body.get("role");
		return adminService.updateUserRole(id, role);
	}

	@DeleteMapping("/users/{id}")
	public String deleteUser(@PathVariable Long id) {
		return adminService.deleteUser(id);
	}
}
