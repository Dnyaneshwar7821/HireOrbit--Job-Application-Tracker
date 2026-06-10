package com.hireorbit.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hireorbit.entity.JobApplication;
import com.hireorbit.entity.User;
import com.hireorbit.repository.UserRepository;
import com.hireorbit.service.JobApplicationService;

@RestController
@RequestMapping("/applications")
public class JobApplicationController {

	@Autowired
	private JobApplicationService jobService;

	@Autowired
	private UserRepository userRepository;

	@PostMapping("/apply-job")
	public JobApplication create(@RequestBody JobApplication app, Authentication authentication) {

		User user = getAuthenticatedUser(authentication);

		return jobService.createApplication(app, user.getId());
	}

	@GetMapping("/get-all-jobs")
	public List<JobApplication> getAll(Authentication authentication) {

		User user = getAuthenticatedUser(authentication);

		return jobService.getAllApplications(user.getId());
	}

	@PutMapping("/update-job/{id}")
	public JobApplication updateById(@PathVariable Long id, @RequestBody JobApplication app,
			Authentication authentication) {
		User user = getAuthenticatedUser(authentication);

		return jobService.updateApplicationById(id, app, user.getId());
	}

	@DeleteMapping("/delete-job/{id}")
	public String delete(@PathVariable Long id, Authentication authentication) {
		User user = getAuthenticatedUser(authentication);

		return jobService.deleteApplication(id, user.getId());
	}

	private User getAuthenticatedUser(Authentication authentication) {
		String email = authentication.getName();

		return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
	}
}
