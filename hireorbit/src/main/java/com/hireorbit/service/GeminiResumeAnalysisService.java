package com.hireorbit.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hireorbit.dto.ResumeMatchResponse;

@Service
public class GeminiResumeAnalysisService {

	private final String apiKey;
	private final String model;
	private final int timeoutSeconds;
	private final HttpClient httpClient;
	private final ObjectMapper objectMapper;

	public GeminiResumeAnalysisService(@Value("${app.gemini.api-key:}") String apiKey,
			@Value("${app.gemini.model:gemini-1.5-flash}") String model,
			@Value("${app.gemini.timeout-seconds:20}") int timeoutSeconds, ObjectMapper objectMapper) {
		this.apiKey = apiKey;
		this.model = model;
		this.timeoutSeconds = timeoutSeconds;
		this.objectMapper = objectMapper;
		this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
	}

	public Optional<ResumeMatchResponse> analyze(String resume, String jobDescription) {
		return analyze(resume, jobDescription, "Professional");
	}

	public Optional<ResumeMatchResponse> analyze(String resume, String jobDescription, String tone) {
		if (apiKey == null || apiKey.isBlank()) {
			return Optional.empty();
		}

		try {
			String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/"
					+ URLEncoder.encode(model, StandardCharsets.UTF_8) + ":generateContent?key="
					+ URLEncoder.encode(apiKey, StandardCharsets.UTF_8);

			Map<String, Object> requestBody = Map.of("contents",
					List.of(Map.of("parts", List.of(Map.of("text", buildPrompt(resume, jobDescription, tone))))),
					"generationConfig",
					Map.of("temperature", 0.2, "maxOutputTokens", 1200, "responseMimeType", "application/json"));

			HttpRequest request = HttpRequest.newBuilder(URI.create(endpoint)).timeout(Duration.ofSeconds(timeoutSeconds))
					.header("Content-Type", "application/json")
					.POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody))).build();

			HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

			if (response.statusCode() < 200 || response.statusCode() >= 300) {
				return Optional.empty();
			}

			JsonNode root = objectMapper.readTree(response.body());
			JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");

			if (textNode.isMissingNode() || textNode.asText().isBlank()) {
				return Optional.empty();
			}

			ResumeMatchResponse result = parseModelJson(textNode.asText());
			result.setAiPowered(true);
			return Optional.of(result);
		} catch (Exception ex) {
			return Optional.empty();
		}
	}

	private ResumeMatchResponse parseModelJson(String text) throws Exception {
		String cleaned = text.replaceAll("(?s)^```json\\s*", "").replaceAll("(?s)^```\\s*", "")
				.replaceAll("(?s)```\\s*$", "").trim();
		Map<String, Object> data = objectMapper.readValue(cleaned, new TypeReference<Map<String, Object>>() {
		});

		ResumeMatchResponse result = new ResumeMatchResponse();
		result.setDetectedRole(stringValue(data.get("detectedRole"), "Unknown"));
		result.setMatchScore(intValue(data.get("matchScore")));
		result.setAtsScore(intValue(data.get("atsScore")));
		result.setMatchedSkills(stringList(data.get("matchedSkills")));
		result.setMissingSkills(stringList(data.get("missingSkills")));
		result.setPartialSkills(stringList(data.get("partialSkills")));
		result.setAnalysis(stringValue(data.get("analysis"), "AI analysis completed."));
		result.setSuggestions(stringList(data.get("suggestions")));
		result.setAtsFeedback(stringList(data.get("atsFeedback")));
		result.setImprovedSummary(stringValue(data.get("improvedSummary"), ""));
		result.setCoverLetter(stringValue(data.get("coverLetter"), ""));
		return result;
	}

	private String buildPrompt(String resume, String jobDescription, String tone) {
		String selectedTone = (tone == null || tone.isBlank()) ? "Professional" : tone;
		return """
				Analyze this resume against this job description for a job seeker.
				Generate a cover letter in a %s tone.
				Return only valid JSON with this exact schema:
				{
				  "detectedRole": "string",
				  "matchScore": 85,
				  "atsScore": 90,
				  "matchedSkills": ["exact skills found in both"],
				  "missingSkills": ["important skills missing from resume"],
				  "partialSkills": ["skills that are related or implicitly mentioned"],
				  "analysis": "detailed alignment evaluation paragraph",
				  "suggestions": ["specific resume improvement recommendation"],
				  "atsFeedback": ["ATS formatting and readability diagnostic note"],
				  "improvedSummary": "rewritten resume summary tailored to the job description",
				  "coverLetter": "tailored cover letter in %s tone"
				}
				Keep matchScore and atsScore from 0 to 100.

				Resume:
				%s

				Job Description:
				%s
				""".formatted(selectedTone, selectedTone, resume, jobDescription);
	}

	private String stringValue(Object value, String fallback) {
		return value == null ? fallback : String.valueOf(value);
	}

	private int intValue(Object value) {
		if (value instanceof Number number) {
			return Math.max(0, Math.min(100, number.intValue()));
		}

		try {
			return Math.max(0, Math.min(100, Integer.parseInt(String.valueOf(value))));
		} catch (Exception ex) {
			return 0;
		}
	}

	private List<String> stringList(Object value) {
		if (value instanceof List<?> list) {
			return list.stream().map(String::valueOf).filter(item -> !item.isBlank()).toList();
		}

		return List.of();
	}
}
