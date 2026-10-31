package com.hireorbit.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hireorbit.dto.ApplicantResponseDTO;
import com.hireorbit.dto.ApplyJobRequestDTO;
import com.hireorbit.dto.JobPostingDTO;
import com.hireorbit.dto.ResumeMatchResponse;
import com.hireorbit.entity.JobApplication;
import com.hireorbit.entity.JobPosting;
import com.hireorbit.entity.User;
import com.hireorbit.exception.ResourceNotFoundException;
import com.hireorbit.repository.JobApplicationRepository;
import com.hireorbit.repository.JobPostingRepository;
import com.hireorbit.repository.UserRepository;

@Service
public class JobPostingService {

	@Autowired
	private JobPostingRepository jobPostingRepo;

	@Autowired
	private JobApplicationRepository jobApplicationRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private GeminiResumeAnalysisService geminiService;

	public JobPosting createJob(JobPosting job, Long adminUserId) {
		User admin = userRepo.findById(adminUserId)
				.orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

		job.setPostedBy(admin);
		job.setPostedDate(LocalDate.now());
		if (job.getStatus() == null || job.getStatus().isBlank()) {
			job.setStatus("ACTIVE");
		}

		return jobPostingRepo.save(job);
	}

	public List<JobPostingDTO> getActiveJobs(String search, String location, String employmentType) {
		List<JobPosting> jobs = jobPostingRepo.findByStatusOrderByPostedDateDesc("ACTIVE");

		return jobs.stream().filter(job -> {
			boolean matchesSearch = true;
			if (search != null && !search.isBlank()) {
				String q = search.toLowerCase().trim();
				matchesSearch = (job.getTitle() != null && job.getTitle().toLowerCase().contains(q))
						|| (job.getCompany() != null && job.getCompany().toLowerCase().contains(q))
						|| (job.getDepartment() != null && job.getDepartment().toLowerCase().contains(q))
						|| (job.getRequiredSkills() != null && job.getRequiredSkills().toLowerCase().contains(q))
						|| (job.getDescription() != null && job.getDescription().toLowerCase().contains(q));
			}

			boolean matchesLocation = true;
			if (location != null && !location.isBlank() && !"ALL".equalsIgnoreCase(location)) {
				matchesLocation = job.getLocation() != null
						&& job.getLocation().toLowerCase().contains(location.toLowerCase().trim());
			}

			boolean matchesType = true;
			if (employmentType != null && !employmentType.isBlank() && !"ALL".equalsIgnoreCase(employmentType)) {
				matchesType = job.getEmploymentType() != null
						&& job.getEmploymentType().equalsIgnoreCase(employmentType.trim());
			}

			return matchesSearch && matchesLocation && matchesType;
		}).map(this::toDTO).collect(Collectors.toList());
	}

	public List<JobPostingDTO> getAllJobsForAdmin() {
		List<JobPosting> jobs = jobPostingRepo.findAllByOrderByPostedDateDesc();
		return jobs.stream().map(this::toDTO).collect(Collectors.toList());
	}

	public JobPosting getJobById(Long id) {
		return jobPostingRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));
	}

	public JobPosting updateJob(Long id, JobPosting updated, Long adminUserId) {
		JobPosting existing = jobPostingRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));

		existing.setTitle(updated.getTitle());
		existing.setCompany(updated.getCompany());
		existing.setLocation(updated.getLocation());
		existing.setEmploymentType(updated.getEmploymentType());
		existing.setSalaryRange(updated.getSalaryRange());
		existing.setDepartment(updated.getDepartment());
		existing.setDescription(updated.getDescription());
		existing.setRequiredSkills(updated.getRequiredSkills());
		if (updated.getStatus() != null && !updated.getStatus().isBlank()) {
			existing.setStatus(updated.getStatus().toUpperCase());
		}

		return jobPostingRepo.save(existing);
	}

	public void deleteJob(Long id, Long adminUserId) {
		JobPosting existing = jobPostingRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));
		jobPostingRepo.delete(existing);
	}

	@Transactional
	public JobApplication applyToJob(Long jobId, ApplyJobRequestDTO request, Long candidateUserId) {
		JobPosting job = jobPostingRepo.findById(jobId)
				.orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));

		if (!"ACTIVE".equalsIgnoreCase(job.getStatus())) {
			throw new RuntimeException("This job posting is no longer accepting applications");
		}

		User candidate = userRepo.findById(candidateUserId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		jobApplicationRepo.findByUserIdAndJobPostingId(candidateUserId, jobId).ifPresent(app -> {
			throw new RuntimeException("You have already applied for this position");
		});

		int matchScore = 0;
		String resume = request.getResumeText() != null ? request.getResumeText() : "";
		String jobDesc = (job.getTitle() + "\n" + job.getDescription() + "\n" + job.getRequiredSkills()).trim();

		if (!resume.isBlank()) {
			try {
				ResumeMatchResponse aiRes = geminiService.analyze(resume, jobDesc).orElse(null);
				if (aiRes != null) {
					matchScore = aiRes.getMatchScore();
				} else {
					matchScore = calculateHeuristicScore(resume, job.getRequiredSkills());
				}
			} catch (Exception ex) {
				matchScore = calculateHeuristicScore(resume, job.getRequiredSkills());
			}
		}

		JobApplication application = new JobApplication();
		application.setCompanyName(job.getCompany());
		application.setJobRole(job.getTitle());
		application.setStatus("APPLIED");
		application.setAppliedDate(LocalDate.now());
		application.setLocation(job.getLocation());
		application.setSalaryRange(job.getSalaryRange());
		application.setEmploymentType(job.getEmploymentType());
		application.setSource("HireOrbit Job Board");
		application.setApplicationType("INTERNAL");
		application.setJobPosting(job);
		application.setUser(candidate);
		application.setResumeText(resume);
		application.setCoverLetter(request.getCoverLetter());
		application.setAiMatchScore(matchScore);

		return jobApplicationRepo.save(application);
	}

	public List<ApplicantResponseDTO> getApplicantsForJob(Long jobId, Long adminUserId) {
		JobPosting job = jobPostingRepo.findById(jobId)
				.orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));

		List<JobApplication> apps = jobApplicationRepo.findByJobPostingIdOrderByAppliedDateDesc(job.getId());

		return apps.stream()
				.sorted((a, b) -> Integer.compare(
						b.getAiMatchScore() != null ? b.getAiMatchScore() : 0,
						a.getAiMatchScore() != null ? a.getAiMatchScore() : 0))
				.map(app -> new ApplicantResponseDTO(
						app.getId(),
						app.getUser() != null ? app.getUser().getId() : null,
						app.getUser() != null ? app.getUser().getName() : "Anonymous",
						app.getUser() != null ? app.getUser().getEmail() : "N/A",
						app.getAppliedDate(),
						app.getStatus(),
						app.getAiMatchScore(),
						app.getCoverLetter(),
						app.getResumeText()))
				.collect(Collectors.toList());
	}

	public JobApplication updateApplicantStatus(Long applicationId, String newStatus, Long adminUserId) {
		JobApplication app = jobApplicationRepo.findById(applicationId)
				.orElseThrow(() -> new ResourceNotFoundException("Application not found"));

		app.setStatus(newStatus.toUpperCase());
		return jobApplicationRepo.save(app);
	}

	@Transactional
	public List<ApplicantResponseDTO> rankApplicantsWithAI(Long jobId, Long adminUserId) {
		JobPosting job = jobPostingRepo.findById(jobId)
				.orElseThrow(() -> new ResourceNotFoundException("Job posting not found"));

		List<JobApplication> apps = jobApplicationRepo.findByJobPostingIdOrderByAppliedDateDesc(job.getId());
		String jobDesc = (job.getTitle() + "\n" + job.getDescription() + "\n" + job.getRequiredSkills()).trim();

		for (JobApplication app : apps) {
			if (app.getResumeText() != null && !app.getResumeText().isBlank()) {
				int score;
				try {
					ResumeMatchResponse aiRes = geminiService.analyze(app.getResumeText(), jobDesc).orElse(null);
					if (aiRes != null) {
						score = aiRes.getMatchScore();
					} else {
						score = calculateHeuristicScore(app.getResumeText(), job.getRequiredSkills());
					}
				} catch (Exception e) {
					score = calculateHeuristicScore(app.getResumeText(), job.getRequiredSkills());
				}
				app.setAiMatchScore(score);
				jobApplicationRepo.save(app);
			}
		}

		return getApplicantsForJob(jobId, adminUserId);
	}

	private int calculateHeuristicScore(String resume, String requiredSkills) {
		if (requiredSkills == null || requiredSkills.isBlank()) {
			return 70; // baseline default
		}

		String[] skills = requiredSkills.split("[,;\\n]+");
		int total = skills.length;
		if (total == 0) return 70;

		int matched = 0;
		String lowerResume = resume.toLowerCase();
		for (String skill : skills) {
			String trimmed = skill.trim().toLowerCase();
			if (!trimmed.isBlank() && lowerResume.contains(trimmed)) {
				matched++;
			}
		}

		return Math.min(100, Math.max(30, (matched * 100) / total));
	}

	private JobPostingDTO toDTO(JobPosting job) {
		long applicantCount = jobApplicationRepo.countByJobPostingId(job.getId());
		return new JobPostingDTO(
				job.getId(),
				job.getTitle(),
				job.getCompany(),
				job.getLocation(),
				job.getEmploymentType(),
				job.getSalaryRange(),
				job.getDepartment(),
				job.getDescription(),
				job.getRequiredSkills(),
				job.getStatus(),
				job.getPostedDate(),
				applicantCount);
	}
}

