package com.hireorbit.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hireorbit.dto.ApplicantResponseDTO;
import com.hireorbit.dto.ApplyJobRequestDTO;
import com.hireorbit.dto.JobPostingDTO;
import com.hireorbit.entity.JobApplication;
import com.hireorbit.entity.JobPosting;
import com.hireorbit.entity.User;
import com.hireorbit.repository.UserRepository;
import com.hireorbit.service.JobPostingService;

@RestController
@RequestMapping("/api/jobs")
public class JobPostingController {

	@Autowired
	private JobPostingService jobPostingService;

	@Autowired
	private UserRepository userRepository;

	// Public: browse active jobs
	@GetMapping
	public List<JobPostingDTO> getJobs(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) String location,
			@RequestParam(required = false) String type) {
		return jobPostingService.getActiveJobs(search, location, type);
	}

	// Public: view single job
	@GetMapping("/{id}")
	public JobPosting getJobById(@PathVariable Long id) {
		return jobPostingService.getJobById(id);
	}

	// Admin: get all jobs (active, paused, closed)
	@GetMapping("/admin/all")
	public List<JobPostingDTO> getAllJobsForAdmin() {
		return jobPostingService.getAllJobsForAdmin();
	}

	// Admin: post new job
	@PostMapping
	public JobPosting createJob(@Valid @RequestBody JobPosting job, Authentication authentication) {
		User admin = getAuthenticatedUser(authentication);
		return jobPostingService.createJob(job, admin.getId());
	}

	// Admin: update job
	@PutMapping("/{id}")
	public JobPosting updateJob(@PathVariable Long id, @RequestBody JobPosting job, Authentication authentication) {
		User admin = getAuthenticatedUser(authentication);
		return jobPostingService.updateJob(id, job, admin.getId());
	}

	// Admin: delete job
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteJob(@PathVariable Long id, Authentication authentication) {
		User admin = getAuthenticatedUser(authentication);
		jobPostingService.deleteJob(id, admin.getId());
		return ResponseEntity.ok("Job posting deleted successfully");
	}

	// Candidate: Apply to an internal job posting
	@PostMapping("/{id}/apply")
	public JobApplication applyToJob(
			@PathVariable Long id,
			@RequestBody ApplyJobRequestDTO request,
			Authentication authentication) {
		User candidate = getAuthenticatedUser(authentication);
		return jobPostingService.applyToJob(id, request, candidate.getId());
	}

	// Admin: view applicants for job
	@GetMapping("/{id}/applicants")
	public List<ApplicantResponseDTO> getApplicants(@PathVariable Long id, Authentication authentication) {
		User admin = getAuthenticatedUser(authentication);
		return jobPostingService.getApplicantsForJob(id, admin.getId());
	}

	// Admin: update applicant status
	@PutMapping("/applications/{appId}/status")
	public JobApplication updateApplicantStatus(
			@PathVariable Long appId,
			@RequestBody Map<String, String> body,
			Authentication authentication) {
		User admin = getAuthenticatedUser(authentication);
		String newStatus = body.getOrDefault("status", "APPLIED");
		return jobPostingService.updateApplicantStatus(appId, newStatus, admin.getId());
	}

	// Admin: run AI candidate screening & ranking
	@PostMapping("/{id}/rank-applicants")
	public List<ApplicantResponseDTO> rankApplicantsWithAI(@PathVariable Long id, Authentication authentication) {
		User admin = getAuthenticatedUser(authentication);
		return jobPostingService.rankApplicantsWithAI(id, admin.getId());
	}

	private User getAuthenticatedUser(Authentication authentication) {
		if (authentication == null || authentication.getName() == null) {
			throw new RuntimeException("Unauthorized");
		}
		return userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new RuntimeException("User not found"));
	}
}

