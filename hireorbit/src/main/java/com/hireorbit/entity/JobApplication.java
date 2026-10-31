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
@Table(name = "job_application")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    private String status; // APPLIED / INTERVIEW / REJECTED / OFFER

    private LocalDate appliedDate;

    private String jobUrl;

    private String location;

    private String salaryRange;

    private String source;

    private String employmentType;

    private LocalDate followUpDate;

    @Column(length = 2000)
    private String notes;

    private String applicationType = "EXTERNAL"; // INTERNAL or EXTERNAL

    private Integer aiMatchScore; // 0 - 100 for ATS screening

    @Column(length = 4000)
    private String coverLetter;

    @Column(length = 10000)
    private String resumeText;

    @ManyToOne
    @JoinColumn(name = "job_posting_id", nullable = true)
    private JobPosting jobPosting;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "jobApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<InterviewRound> interviewRounds;
}
