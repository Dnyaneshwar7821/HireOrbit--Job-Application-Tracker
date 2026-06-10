package com.hireorbit.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hireorbit.entity.JobApplication;
import com.hireorbit.entity.User;
import com.hireorbit.exception.ResourceNotFoundException;
import com.hireorbit.repository.JobApplicationRepository;
import com.hireorbit.repository.UserRepository;

@Service
public class JobApplicationService {

	@Autowired
	private JobApplicationRepository jobRepo;

	@Autowired
	private UserRepository userRepo;

	public JobApplication createApplication(JobApplication application, Long userId) {

		User user = userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		application.setUser(user);
		application.setAppliedDate(LocalDate.now());

		return jobRepo.save(application);
	}

	public List<JobApplication> getAllApplications(Long userId) {
		return jobRepo.findByUserId(userId);
	}

	public JobApplication updateApplicationById(Long id, JobApplication updatedApp, Long userId) {

		JobApplication existing = jobRepo.findByIdAndUserId(id, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Application not found"));

		existing.setCompanyName(updatedApp.getCompanyName());
		existing.setJobRole(updatedApp.getJobRole());
		existing.setStatus(updatedApp.getStatus());
		existing.setJobUrl(updatedApp.getJobUrl());
		existing.setLocation(updatedApp.getLocation());
		existing.setSalaryRange(updatedApp.getSalaryRange());
		existing.setSource(updatedApp.getSource());
		existing.setEmploymentType(updatedApp.getEmploymentType());
		existing.setFollowUpDate(updatedApp.getFollowUpDate());
		existing.setNotes(updatedApp.getNotes());
		return jobRepo.save(existing);
	}

	public String deleteApplication(Long id, Long userId) {
		JobApplication existing = jobRepo.findByIdAndUserId(id, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Application not found"));

		jobRepo.delete(existing);
		return "Deleted";
	}

}
