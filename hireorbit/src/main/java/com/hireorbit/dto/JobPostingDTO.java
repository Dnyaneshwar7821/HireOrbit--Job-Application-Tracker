package com.hireorbit.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingDTO {

	private Long id;
	private String title;
	private String company;
	private String location;
	private String employmentType;
	private String salaryRange;
	private String department;
	private String description;
	private String requiredSkills;
	private String status;
	private LocalDate postedDate;
	private long applicantCount;
}

