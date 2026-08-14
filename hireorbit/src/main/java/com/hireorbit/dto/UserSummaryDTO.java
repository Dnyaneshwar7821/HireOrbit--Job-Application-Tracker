package com.hireorbit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {

	private Long id;
	private String name;
	private String email;
	private String role;
	private long applicationCount;
}
