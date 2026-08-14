package com.hireorbit.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hireorbit.dto.AdminStatsDTO;
import com.hireorbit.dto.UserSummaryDTO;
import com.hireorbit.entity.User;
import com.hireorbit.exception.ResourceNotFoundException;
import com.hireorbit.repository.JobApplicationRepository;
import com.hireorbit.repository.ResumeAnalysisRepository;
import com.hireorbit.repository.UserRepository;

import com.hireorbit.entity.InterviewRound;
import com.hireorbit.entity.JobApplication;
import com.hireorbit.entity.ResumeAnalysis;
import com.hireorbit.repository.InterviewRoundRepository;

@Service
public class AdminService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JobApplicationRepository jobApplicationRepository;

	@Autowired
	private InterviewRoundRepository interviewRoundRepository;

	@Autowired
	private ResumeAnalysisRepository resumeAnalysisRepository;

	public AdminStatsDTO getPlatformStats() {
		long totalUsers = userRepository.count();
		long totalApplications = jobApplicationRepository.count();
		long totalInterviews = jobApplicationRepository.countByStatus("INTERVIEW");
		long totalOffers = jobApplicationRepository.countByStatus("OFFER");
		long totalRejected = jobApplicationRepository.countByStatus("REJECTED");
		long totalApplied = jobApplicationRepository.countByStatus("APPLIED");
		long totalResumeAnalyses = 0;
		try {
			totalResumeAnalyses = resumeAnalysisRepository.count();
		} catch (Exception ignored) {
		}

		double successRate = totalApplications == 0 ? 0 : (totalOffers * 100.0) / totalApplications;

		Map<String, Long> breakdown = new HashMap<>();
		breakdown.put("APPLIED", totalApplied);
		breakdown.put("INTERVIEW", totalInterviews);
		breakdown.put("OFFER", totalOffers);
		breakdown.put("REJECTED", totalRejected);

		return new AdminStatsDTO(totalUsers, totalApplications, totalInterviews, totalOffers, totalRejected,
				totalResumeAnalyses, successRate, breakdown);
	}

	public List<UserSummaryDTO> getAllUsers() {
		List<User> users = userRepository.findAll();
		return users.stream().map(user -> {
			long appCount = jobApplicationRepository.countByUserId(user.getId());
			return new UserSummaryDTO(user.getId(), user.getName(), user.getEmail(), user.getRole(), appCount);
		}).toList();
	}

	public UserSummaryDTO updateUserRole(Long userId, String newRole) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		user.setRole(newRole.toUpperCase());
		User saved = userRepository.save(user);
		long appCount = jobApplicationRepository.countByUserId(saved.getId());
		return new UserSummaryDTO(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole(), appCount);
	}

	@org.springframework.transaction.annotation.Transactional
	public String deleteUser(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if ("admin@hireorbit.com".equalsIgnoreCase(user.getEmail())) {
			throw new IllegalArgumentException("Cannot delete primary admin account");
		}

		// 1. Delete all interview rounds for user's job applications
		List<JobApplication> apps = jobApplicationRepository.findByUserId(userId);
		for (JobApplication app : apps) {
			List<InterviewRound> rounds = interviewRoundRepository.findByJobApplicationId(app.getId());
			if (!rounds.isEmpty()) {
				interviewRoundRepository.deleteAllInBatch(rounds);
			}
		}

		// 2. Delete all job applications for user
		if (!apps.isEmpty()) {
			jobApplicationRepository.deleteAllInBatch(apps);
		}

		// 3. Delete all resume analyses for user
		List<ResumeAnalysis> analyses = resumeAnalysisRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
		if (!analyses.isEmpty()) {
			resumeAnalysisRepository.deleteAllInBatch(analyses);
		}

		// 4. Delete user
		userRepository.delete(user);

		return "User deleted successfully";
	}
}
