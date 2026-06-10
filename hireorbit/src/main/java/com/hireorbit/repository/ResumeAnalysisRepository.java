package com.hireorbit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hireorbit.entity.ResumeAnalysis;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {

	List<ResumeAnalysis> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
