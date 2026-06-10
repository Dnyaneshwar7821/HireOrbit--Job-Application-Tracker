package com.hireorbit;

import static org.junit.jupiter.api.Assertions.assertThrows;

import javax.transaction.Transactional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.hireorbit.entity.InterviewRound;
import com.hireorbit.entity.JobApplication;
import com.hireorbit.entity.User;
import com.hireorbit.exception.ResourceNotFoundException;
import com.hireorbit.repository.InterviewRoundRepository;
import com.hireorbit.repository.JobApplicationRepository;
import com.hireorbit.repository.UserRepository;
import com.hireorbit.service.AuthService;
import com.hireorbit.service.InterviewRoundService;
import com.hireorbit.service.JobApplicationService;

@SpringBootTest
@Transactional
class SecurityOwnershipTests {

	@Autowired
	private AuthService authService;

	@Autowired
	private InterviewRoundRepository interviewRoundRepository;

	@Autowired
	private InterviewRoundService interviewRoundService;

	@Autowired
	private JobApplicationRepository jobApplicationRepository;

	@Autowired
	private JobApplicationService jobApplicationService;

	@Autowired
	private UserRepository userRepository;

	@Test
	void registerRejectsDuplicateEmail() {
		User first = new User();
		first.setName("First User");
		first.setEmail("duplicate@example.com");
		first.setPassword("password123");

		User second = new User();
		second.setName("Second User");
		second.setEmail("duplicate@example.com");
		second.setPassword("password456");

		authService.register(first);

		assertThrows(RuntimeException.class, () -> authService.register(second));
	}

	@Test
	void userCannotUpdateAnotherUsersApplication() {
		User owner = saveUser("Owner", "owner@example.com");
		User stranger = saveUser("Stranger", "stranger@example.com");
		JobApplication application = saveApplication(owner);

		JobApplication update = new JobApplication();
		update.setCompanyName("Changed");
		update.setJobRole("Changed Role");
		update.setStatus("OFFER");

		assertThrows(ResourceNotFoundException.class,
				() -> jobApplicationService.updateApplicationById(application.getId(), update, stranger.getId()));
	}

	@Test
	void userCannotDeleteAnotherUsersApplication() {
		User owner = saveUser("Delete Owner", "delete-owner@example.com");
		User stranger = saveUser("Delete Stranger", "delete-stranger@example.com");
		JobApplication application = saveApplication(owner);

		assertThrows(ResourceNotFoundException.class,
				() -> jobApplicationService.deleteApplication(application.getId(), stranger.getId()));
	}

	@Test
	void userCannotReadAnotherUsersInterviewRounds() {
		User owner = saveUser("Interview Owner", "interview-owner@example.com");
		User stranger = saveUser("Interview Stranger", "interview-stranger@example.com");
		JobApplication application = saveApplication(owner);

		assertThrows(ResourceNotFoundException.class,
				() -> interviewRoundService.getRounds(application.getId(), stranger.getId()));
	}

	@Test
	void userCannotUpdateAnotherUsersInterviewRound() {
		User owner = saveUser("Round Owner", "round-owner@example.com");
		User stranger = saveUser("Round Stranger", "round-stranger@example.com");
		JobApplication application = saveApplication(owner);

		InterviewRound round = new InterviewRound();
		round.setRoundName("Technical");
		round.setResult("PENDING");
		round.setJobApplication(application);
		InterviewRound savedRound = interviewRoundRepository.save(round);

		InterviewRound update = new InterviewRound();
		update.setRoundName("HR");
		update.setResult("PASS");

		assertThrows(ResourceNotFoundException.class,
				() -> interviewRoundService.updateRoundById(savedRound.getId(), update, stranger.getId()));
	}

	private JobApplication saveApplication(User user) {
		JobApplication application = new JobApplication();
		application.setCompanyName("Acme");
		application.setJobRole("Developer");
		application.setStatus("APPLIED");
		application.setUser(user);

		return jobApplicationRepository.save(application);
	}

	private User saveUser(String name, String email) {
		User user = new User();
		user.setName(name);
		user.setEmail(email);
		user.setPassword("password");
		user.setRole("USER");

		return userRepository.save(user);
	}
}
