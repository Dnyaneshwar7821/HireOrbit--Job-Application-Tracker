package com.hireorbit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hireorbit.entity.InterviewRound;

public interface InterviewRoundRepository extends JpaRepository<InterviewRound, Long>{
	
	List<InterviewRound> findByJobApplicationId(Long applicationId);

	Optional<InterviewRound> findByIdAndJobApplication_User_Id(Long id, Long userId);

}
