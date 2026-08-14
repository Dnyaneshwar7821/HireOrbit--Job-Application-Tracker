package com.hireorbit.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {

	private long totalUsers;
	private long totalApplications;
	private long totalInterviews;
	private long totalOffers;
	private long totalRejected;
	private long totalResumeAnalyses;
	private double successRate;
	private Map<String, Long> statusBreakdown;
}
