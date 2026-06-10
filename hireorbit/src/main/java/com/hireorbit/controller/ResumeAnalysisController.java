package com.hireorbit.controller;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hireorbit.dto.ResumeMatchResponse;
import com.hireorbit.entity.ResumeAnalysis;
import com.hireorbit.entity.User;
import com.hireorbit.repository.ResumeAnalysisRepository;
import com.hireorbit.repository.UserRepository;
import com.hireorbit.service.GeminiResumeAnalysisService;

@RestController
@RequestMapping("/analysis")
public class ResumeAnalysisController {

	private final ResumeAnalysisRepository resumeAnalysisRepository;
	private final UserRepository userRepository;
	private final GeminiResumeAnalysisService geminiResumeAnalysisService;

	public ResumeAnalysisController(ResumeAnalysisRepository resumeAnalysisRepository, UserRepository userRepository,
			GeminiResumeAnalysisService geminiResumeAnalysisService) {
		this.resumeAnalysisRepository = resumeAnalysisRepository;
		this.userRepository = userRepository;
		this.geminiResumeAnalysisService = geminiResumeAnalysisService;
	}

	@PostMapping("/resume-match")
	public ResponseEntity<ResumeMatchResponse> match(@RequestBody Map<String, String> req,
			Authentication authentication) {

		String rawResume = req.get("resume");
		String rawJob = req.get("job");
		String resume = normalize(rawResume);
		String job = normalize(rawJob);

		ResumeMatchResponse aiResult = geminiResumeAnalysisService.analyze(rawResume, rawJob).orElse(null);
		if (aiResult != null) {
			saveHistory(authentication, aiResult);
			return ResponseEntity.ok(aiResult);
		}

		Map<String, Set<String>> roleSkills = new HashMap<>();

		roleSkills.put("Backend Developer",
				Set.of("java", "spring", "spring boot", "node", "express", "django", "mysql", "api", "rest"));
		roleSkills.put("Frontend Developer",
				Set.of("react", "angular", "vue", "html", "css", "javascript", "typescript"));
		roleSkills.put("Full Stack Developer", Set.of("java", "spring", "react", "node", "mysql", "api", "javascript"));
		roleSkills.put("DevOps Engineer",
				Set.of("docker", "kubernetes", "aws", "azure", "gcp", "jenkins", "ci/cd", "terraform"));
		roleSkills.put("Data / AI Engineer",
				Set.of("python", "pandas", "numpy", "machine learning", "tensorflow", "pytorch"));
		roleSkills.put("QA Engineer",
				Set.of("selenium", "cypress", "junit", "testng", "automation testing", "manual testing"));
		roleSkills.put("Mobile Developer", Set.of("android", "kotlin", "swift", "flutter", "react native"));
		roleSkills.put("Cloud Engineer", Set.of("aws", "azure", "gcp", "ec2", "lambda", "s3", "cloudwatch"));
		roleSkills.put("Security Engineer",
				Set.of("cybersecurity", "jwt", "oauth", "encryption", "penetration testing"));
		roleSkills.put("C++ Developer", Set.of("cpp", "stl", "multithreading", "memory management", "concurrency"));
		roleSkills.put("Data Analyst", Set.of("sql", "excel", "power bi", "tableau", "python", "data analysis"));
		roleSkills.put("Machine Learning Engineer",
				Set.of("python", "tensorflow", "pytorch", "scikit", "machine learning", "deep learning"));
		roleSkills.put("Site Reliability Engineer",
				Set.of("linux", "docker", "kubernetes", "monitoring", "ci/cd", "aws"));
		roleSkills.put("Game Developer", Set.of("cpp", "unity", "unreal", "game development", "graphics"));
		roleSkills.put("Embedded Systems Engineer", Set.of("c", "cpp", "embedded", "rtos", "firmware", "hardware"));
		roleSkills.put("Database Administrator", Set.of("mysql", "postgresql", "oracle", "database", "sql", "backup"));
		roleSkills.put("Network Engineer", Set.of("networking", "tcp/ip", "dns", "firewall", "routing", "switching"));
		roleSkills.put("UI/UX Designer", Set.of("figma", "adobe xd", "ui", "ux", "design", "prototyping"));
		roleSkills.put("Business Analyst", Set.of("requirements", "analysis", "documentation", "stakeholders", "sql"));
		roleSkills.put("Software Architect",
				Set.of("system design", "architecture", "microservices", "scalability", "design patterns"));

		Set<String> knownSkills = roleSkills.values().stream().flatMap(Set::stream).collect(Collectors.toSet());
		Set<String> ignoreWords = Set.of("requirements", "responsibilities", "experience", "knowledge", "understanding",
				"skills", "strong", "good");

		Set<String> required = new HashSet<>();
		Set<String> optional = new HashSet<>();
		Set<String> matched = new HashSet<>();
		Set<String> missing = new HashSet<>();

		boolean inOptional = false;

		for (String line : job.split("\n")) {
			if (line.contains("good to have") || line.contains("optional")) {
				inOptional = true;
			}

			for (String skill : knownSkills) {
				if (containsSkill(line, skill) && !ignoreWords.contains(skill)) {
					if (inOptional) {
						optional.add(skill);
					} else {
						required.add(skill);
					}
				}
			}
		}

		int score = 0;
		int totalWeight = 0;

		for (String skill : required) {
			totalWeight += 2;
			if (containsSkill(resume, skill)) {
				matched.add(skill);
				score += 2;
			} else {
				missing.add(skill);
			}
		}

		for (String skill : optional) {
			totalWeight += 1;
			if (containsSkill(resume, skill)) {
				matched.add(skill);
				score += 1;
			} else {
				missing.add(skill);
			}
		}

		int finalScore = totalWeight == 0 ? 0 : (score * 100) / totalWeight;
		String bestRole = detectRole(resume, roleSkills);
		String feedback = feedbackFor(finalScore);

		ResumeMatchResponse result = new ResumeMatchResponse(bestRole, finalScore, sort(matched), sort(missing),
				feedback, fallbackSuggestions(missing), "", "", false);

		saveHistory(authentication, result);

		return ResponseEntity.ok(result);
	}

	@GetMapping("/history")
	public List<ResumeAnalysis> history(Authentication authentication) {
		User user = currentUser(authentication);

		return resumeAnalysisRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId());
	}

	private void saveHistory(Authentication authentication, ResumeMatchResponse result) {
		User user = currentUser(authentication);

		ResumeAnalysis saved = new ResumeAnalysis();
		saved.setDetectedRole(result.getDetectedRole());
		saved.setMatchScore(result.getMatchScore());
		saved.setMatchedSkills(String.join(", ", result.getMatchedSkills()));
		saved.setMissingSkills(String.join(", ", result.getMissingSkills()));
		saved.setAnalysis(result.getAnalysis());
		saved.setSuggestions(String.join("\n", result.getSuggestions()));
		saved.setImprovedSummary(result.getImprovedSummary());
		saved.setCoverLetter(result.getCoverLetter());
		saved.setAiPowered(result.isAiPowered());
		saved.setCreatedAt(LocalDateTime.now());
		saved.setUser(user);

		resumeAnalysisRepository.save(saved);
	}

	private User currentUser(Authentication authentication) {
		if (authentication == null || authentication.getName() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login again");
		}

		return userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login again"));
	}

	private String detectRole(String resume, Map<String, Set<String>> roleSkills) {
		String bestRole = "Unknown";
		int maxMatch = 0;

		for (Map.Entry<String, Set<String>> entry : roleSkills.entrySet()) {
			int count = 0;

			for (String skill : entry.getValue()) {
				if (containsSkill(resume, skill)) {
					count++;
				}
			}

			if (count > maxMatch) {
				maxMatch = count;
				bestRole = entry.getKey();
			}
		}

		return bestRole;
	}

	private String feedbackFor(int finalScore) {
		if (finalScore >= 80) {
			return "Excellent match.";
		}
		if (finalScore >= 60) {
			return "Good match.";
		}
		if (finalScore >= 40) {
			return "Average match.";
		}
		return "Low match.";
	}

	private List<String> fallbackSuggestions(Set<String> missing) {
		if (missing.isEmpty()) {
			return List.of("Add measurable impact and project outcomes to make your resume stronger.");
		}

		return missing.stream().sorted().limit(5).map(skill -> "Add or highlight relevant " + skill + " experience.")
				.collect(Collectors.toList());
	}

	private boolean containsSkill(String text, String skill) {
		String skillPattern = Arrays.stream(skill.split("\\s+")).map(Pattern::quote).collect(Collectors.joining("\\s+"));

		return Pattern.compile("(^|\\W)" + skillPattern + "($|\\W)").matcher(text).find();
	}

	private String normalize(String text) {
		if (text == null) {
			return "";
		}

		String t = text.toLowerCase();

		t = t.replace("c++", "cpp");
		t = t.replace("c#", "csharp");
		t = t.replace("springboot", "spring boot");
		t = t.replace("react.js", "react");
		t = t.replace("node.js", "node");
		t = t.replace("js", "javascript");

		return t;
	}

	private List<String> sort(Set<String> set) {
		return set.stream().sorted().collect(Collectors.toList());
	}
}
