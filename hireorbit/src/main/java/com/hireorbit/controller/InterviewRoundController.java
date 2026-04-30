package com.hireorbit.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hireorbit.entity.InterviewRound;
import com.hireorbit.service.InterviewRoundService;

@RestController
@RequestMapping("/interviews")
@CrossOrigin("http://localhost:5173")
public class InterviewRoundController {

	@Autowired
	private InterviewRoundService interviewService;

	@PostMapping("/add-interview/{applicationId}")
	public InterviewRound addRound(@RequestBody InterviewRound round,
			@PathVariable Long applicationId) {
		return interviewService.addRound(round, applicationId);
	}

	@GetMapping("/get-interviews/{applicationId}")
	public List<InterviewRound> getRounds(@PathVariable Long applicationId) {
		return interviewService.getRounds(applicationId);
	}

	@PutMapping("/update-interview/{id}")
	public InterviewRound updateRound(@PathVariable Long id,
			@RequestBody InterviewRound round) {
		return interviewService.updateRoundById(id, round);
	}
}