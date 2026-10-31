package com.hireorbit.entity;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

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
@Table(name = "job_postings")
public class JobPosting {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Job title is required")
	private String title;

	@NotBlank(message = "Company name is required")
	private String company;

	private String location;

	private String employmentType; // Full-time, Part-time, Contract, Internship, Remote

	private String salaryRange;

	private String department;

	@Column(length = 5000)
	private String description;

	@Column(length = 2000)
	private String requiredSkills;

	private String status = "ACTIVE"; // ACTIVE, PAUSED, CLOSED

	private LocalDate postedDate = LocalDate.now();

	@ManyToOne
	@JoinColumn(name = "posted_by_user_id")
	private User postedBy;

	@OneToMany(mappedBy = "jobPosting", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<JobApplication> applicants;
}

