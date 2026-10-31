package com.hireorbit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hireorbit.entity.ResumeAnalysis;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {

	List<ResumeAnalysis> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);

	void deleteByUserId(Long userId);
}
