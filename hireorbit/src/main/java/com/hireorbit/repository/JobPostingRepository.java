package com.hireorbit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hireorbit.entity.JobPosting;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

	List<JobPosting> findByStatusOrderByPostedDateDesc(String status);

	List<JobPosting> findAllByOrderByPostedDateDesc();

	List<JobPosting> findByPostedByIdOrderByPostedDateDesc(Long userId);

	long countByStatus(String status);
}

