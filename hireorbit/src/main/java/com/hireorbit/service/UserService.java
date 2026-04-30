package com.hireorbit.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.hireorbit.entity.User;
import com.hireorbit.exception.ResourceNotFoundException;
import com.hireorbit.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	public User getUserById(Long id) {
		return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

	public User updateUserById(Long id, User updatedUser) {

		User existing = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		existing.setName(updatedUser.getName());
		existing.setEmail(updatedUser.getEmail());

		return userRepository.save(existing);
	}

	public String deleteAccount(String email, String password) {

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		// 🔒 verify password
		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new RuntimeException("Invalid password");
		}

		// 🔥 delete user (applications auto deleted if cascade is set)
		userRepository.delete(user);

		return "Account deleted successfully";
	}
}
