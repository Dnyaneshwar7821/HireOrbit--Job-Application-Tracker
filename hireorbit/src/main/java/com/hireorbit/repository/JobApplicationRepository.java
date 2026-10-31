package com.hireorbit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hireorbit.entity.JobApplication;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

	List<JobApplication> findByUserId(Long userId);

	Optional<JobApplication> findByIdAndUserId(Long id, Long userId);

	List<JobApplication> findByStatus(String status);

	long countByStatus(String status);

	long countByUserId(Long userId);

	long countByUserIdAndStatus(Long userId, String status);

	List<JobApplication> findByJobPostingIdOrderByAppliedDateDesc(Long jobPostingId);

	Optional<JobApplication> findByUserIdAndJobPostingId(Long userId, Long jobPostingId);

	long countByJobPostingId(Long jobPostingId);
}
