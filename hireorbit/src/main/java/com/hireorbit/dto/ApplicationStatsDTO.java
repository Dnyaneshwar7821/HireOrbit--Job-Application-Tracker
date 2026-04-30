package com.hireorbit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatsDTO {

    private long totalApplications;
    private long applied;
    private long interview;
    private long rejected;
    private long offer;
    private double successRate; 
}