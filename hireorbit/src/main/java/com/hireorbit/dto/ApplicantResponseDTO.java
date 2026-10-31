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
public class ApplicantResponseDTO {

	private Long applicationId;
	private Long candidateId;
	private String candidateName;
	private String candidateEmail;
	private LocalDate appliedDate;
	private String status;
	private Integer aiMatchScore;
	private String coverLetter;
	private String resumeText;
}

