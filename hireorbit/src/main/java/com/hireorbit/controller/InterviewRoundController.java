package com.hireorbit.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.hireorbit.entity.InterviewRound;
import com.hireorbit.entity.User;
import com.hireorbit.repository.UserRepository;
import com.hireorbit.service.InterviewRoundService;

@RestController
@RequestMapping("/interviews")
public class InterviewRoundController {

	@Autowired
	private InterviewRoundService interviewService;

	@Autowired
	private UserRepository userRepository;

	@PostMapping("/add-interview/{applicationId}")
	public InterviewRound addRound(@RequestBody InterviewRound round,
			@PathVariable Long applicationId, Authentication authentication) {
		User user = getAuthenticatedUser(authentication);

		return interviewService.addRound(round, applicationId, user.getId());
	}

	@GetMapping("/get-interviews/{applicationId}")
	public List<InterviewRound> getRounds(@PathVariable Long applicationId, Authentication authentication) {
		User user = getAuthenticatedUser(authentication);

		return interviewService.getRounds(applicationId, user.getId());
	}

	@PutMapping("/update-interview/{id}")
	public InterviewRound updateRound(@PathVariable Long id,
			@RequestBody InterviewRound round, Authentication authentication) {
		User user = getAuthenticatedUser(authentication);

		return interviewService.updateRoundById(id, round, user.getId());
	}

	private User getAuthenticatedUser(Authentication authentication) {
		String email = authentication.getName();

		return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
	}
}
