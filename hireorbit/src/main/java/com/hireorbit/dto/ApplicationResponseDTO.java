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
public class ApplicationResponseDTO {

    private Long id;
    private String companyName;
    private String jobRole;
    private String status;
    private LocalDate appliedDate;
}