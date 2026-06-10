package com.hireorbit.entity;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

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
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;

    private String jobRole;

    private String status; // APPLIED / INTERVIEW / REJECTED / OFFER

    private LocalDate appliedDate;

    private String jobUrl;

    private String location;

    private String salaryRange;

    private String source;

    private String employmentType;

    private LocalDate followUpDate;

    @javax.persistence.Column(length = 2000)
    private String notes;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "jobApplication", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<InterviewRound> interviewRounds;
}

