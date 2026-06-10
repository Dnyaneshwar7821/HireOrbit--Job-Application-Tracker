package com.hireorbit.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "resume_analysis")
public class ResumeAnalysis {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String detectedRole;

	private int matchScore;

	@Column(length = 2000)
	private String matchedSkills;

	@Column(length = 2000)
	private String missingSkills;

	@Column(length = 4000)
	private String analysis;

	@Column(length = 4000)
	private String suggestions;

	@Column(length = 4000)
	private String improvedSummary;

	@Column(length = 4000)
	private String coverLetter;

	private boolean aiPowered;

	private LocalDateTime createdAt;

	@ManyToOne
	@JoinColumn(name = "user_id")
	@JsonIgnore
	private User user;
}
