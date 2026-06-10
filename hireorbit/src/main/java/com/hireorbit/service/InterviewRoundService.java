package com.hireorbit.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hireorbit.entity.InterviewRound;
import com.hireorbit.entity.JobApplication;
import com.hireorbit.exception.ResourceNotFoundException;
import com.hireorbit.repository.InterviewRoundRepository;
import com.hireorbit.repository.JobApplicationRepository;

@Service
public class InterviewRoundService {

	@Autowired
	private InterviewRoundRepository interviewRepo;

	@Autowired
	private JobApplicationRepository jobRepo;

	// 🔥 ADD ROUND
	public InterviewRound addRound(InterviewRound round, Long applicationId, Long userId) {

		JobApplication application = jobRepo.findByIdAndUserId(applicationId, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Application not found"));

		round.setJobApplication(application);
		round.setDate(LocalDate.now());

		InterviewRound saved = interviewRepo.save(round);

		// 🔥 UPDATE APPLICATION STATUS
		recalculateApplicationStatus(applicationId);

		return saved;
	}

	// 🔥 GET ROUNDS
	public List<InterviewRound> getRounds(Long applicationId, Long userId) {
		jobRepo.findByIdAndUserId(applicationId, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Application not found"));

		return interviewRepo.findByJobApplicationId(applicationId);
	}

	// 🔥 UPDATE ROUND
	public InterviewRound updateRoundById(Long id, InterviewRound updatedRound, Long userId) {

		InterviewRound existing = interviewRepo.findByIdAndJobApplication_User_Id(id, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

		existing.setRoundName(updatedRound.getRoundName());
		existing.setResult(updatedRound.getResult());
		existing.setDate(LocalDate.now());

		InterviewRound saved = interviewRepo.save(existing);

		// 🔥 UPDATE APPLICATION STATUS
		Long applicationId = existing.getJobApplication().getId();
		recalculateApplicationStatus(applicationId);

		return saved;
	}

	// 🔥 CORE LOGIC (IMPORTANT)
	private void recalculateApplicationStatus(Long applicationId) {

		List<InterviewRound> rounds = interviewRepo.findByJobApplicationId(applicationId);

		JobApplication app = jobRepo.findById(applicationId)
				.orElseThrow(() -> new ResourceNotFoundException("Application not found"));

		boolean hasPending = rounds.stream().anyMatch(r -> "PENDING".equalsIgnoreCase(r.getResult()));

		boolean hasFail = rounds.stream().anyMatch(r -> "FAIL".equalsIgnoreCase(r.getResult()));

		boolean allPass = !rounds.isEmpty() && rounds.stream().allMatch(r -> "PASS".equalsIgnoreCase(r.getResult()));

		if (hasPending) {
			app.setStatus("INTERVIEW");
		} else if (allPass) {
			app.setStatus("OFFER");
		} else if (hasFail) {
			app.setStatus("REJECTED");
		}

		jobRepo.save(app);
	}
}
