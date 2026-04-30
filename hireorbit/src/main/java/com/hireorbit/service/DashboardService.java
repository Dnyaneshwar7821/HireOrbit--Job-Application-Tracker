package com.hireorbit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hireorbit.dto.ApplicationStatsDTO;
import com.hireorbit.repository.JobApplicationRepository;

@Service
public class DashboardService {

	@Autowired
	private JobApplicationRepository jobRepo;

	public ApplicationStatsDTO getStats(Long userId) {

		long total = jobRepo.countByUserId(userId);
		long applied = jobRepo.countByUserIdAndStatus(userId, "APPLIED");
		long interview = jobRepo.countByUserIdAndStatus(userId, "INTERVIEW");
		long rejected = jobRepo.countByUserIdAndStatus(userId, "REJECTED");
		long offer = jobRepo.countByUserIdAndStatus(userId, "OFFER");

		double successRate = total == 0 ? 0 : (offer * 100.0) / total;

		return new ApplicationStatsDTO(total, applied, interview, rejected, offer, successRate);
	}
}