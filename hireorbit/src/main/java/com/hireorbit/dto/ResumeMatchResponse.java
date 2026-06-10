package com.hireorbit.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeMatchResponse {

	private String detectedRole;
	private int matchScore;
	private List<String> matchedSkills;
	private List<String> missingSkills;
	private String analysis;
	private List<String> suggestions;
	private String improvedSummary;
	private String coverLetter;
	private boolean aiPowered;
}
