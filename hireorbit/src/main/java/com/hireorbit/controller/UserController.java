package com.hireorbit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hireorbit.entity.User;
import com.hireorbit.service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin("http://localhost:5173")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping("/get-all-users")
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}

	@GetMapping("/get-user-by-id/{id}")
	public User getUser(@PathVariable Long id) {
		return userService.getUserById(id);
	}

	@PutMapping("/update-user/{id}")
	public User updateUserById(@PathVariable Long id, @RequestBody User user) {
		return userService.updateUserById(id, user);
	}

	@DeleteMapping("/delete-account")
	public ResponseEntity<String> deleteAccount(
	        @RequestBody(required = false) Map<String, String> req,
	        Authentication authentication) {

	    if (req == null || !req.containsKey("password")) {
	        return ResponseEntity.badRequest().body("Password is required");
	    }

	    String email = authentication.getName();
	    String password = req.get("password");

	    return ResponseEntity.ok(userService.deleteAccount(email, password));
	}
}