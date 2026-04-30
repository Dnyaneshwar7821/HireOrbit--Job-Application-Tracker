package com.hireorbit.controller;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analysis")
@CrossOrigin(origins = "http://localhost:5173")
public class ResumeAnalysisController {

	@PostMapping("/resume-match")
	public ResponseEntity<String> match(@RequestBody Map<String, String> req) {

		String resume = normalize(req.get("resume"));
		String job = normalize(req.get("job"));

		// 🔹 Role Skills
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

		// 🔹 Flatten all skills
		Set<String> knownSkills = roleSkills.values().stream().flatMap(Set::stream).collect(Collectors.toSet());

		// 🔹 Stop words (remove noise)
		Set<String> ignoreWords = Set.of("requirements", "responsibilities", "experience", "knowledge", "understanding",
				"skills", "strong", "good");

		Set<String> required = new HashSet<>();
		Set<String> optional = new HashSet<>();
		Set<String> matched = new HashSet<>();
		Set<String> missing = new HashSet<>();

		boolean inOptional = false;

		// 🔹 Extract skills from job description
		for (String line : job.split("\n")) {

			if (line.contains("good to have") || line.contains("optional")) {
				inOptional = true;
			}

			for (String skill : knownSkills) {
				if (containsSkill(line, skill) && !ignoreWords.contains(skill)) {
					if (inOptional)
						optional.add(skill);
					else
						required.add(skill);
				}
			}
		}

		// 🔹 Scoring
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

		// 🔹 Role Detection
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

		// 🔹 Feedback
		String feedback;
		if (finalScore >= 80)
			feedback = "Excellent match.";
		else if (finalScore >= 60)
			feedback = "Good match.";
		else if (finalScore >= 40)
			feedback = "Average match.";
		else
			feedback = "Low match.";

		String result = "Detected Role: " + bestRole + "\n\n" + "Match Score: " + finalScore + "%\n\n"
				+ "Matched Skills: " + sort(matched) + "\n\n" + "Missing Skills: " + sort(missing) + "\n\n"
				+ "Analysis: " + feedback;

		return ResponseEntity.ok(result);
	}

	// 🔹 Exact word matching (NO noise)
	private boolean containsSkill(String text, String skill) {
		List<String> words = Arrays.asList(text.split("\\W+"));
		return words.contains(skill);
	}

	private String normalize(String text) {
		if (text == null)
			return "";

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