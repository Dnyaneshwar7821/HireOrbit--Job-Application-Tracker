package com.hireorbit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hireorbit.entity.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

	List<JobApplication> findByUserId(Long userId);

	List<JobApplication> findByStatus(String status);

	long countByStatus(String status); // optional (can keep)

	long countByUserId(Long userId);

	long countByUserIdAndStatus(Long userId, String status);
}