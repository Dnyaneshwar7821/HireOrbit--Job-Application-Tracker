package com.hireorbit.config;

import java.io.IOException;
import java.util.Collections;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.hireorbit.util.JwtUtil;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String header = request.getHeader("Authorization");

		if (header != null && header.startsWith("Bearer ")) {

			String token = header.substring(7);

			try {
				if (jwtUtil.validateToken(token)) {

					String email = jwtUtil.extractEmail(token);

					if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

						UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null,
								Collections.emptyList());

						auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

						SecurityContextHolder.getContext().setAuthentication(auth);
					}
				}
			} catch (Exception e) {
				System.out.println("JWT error: " + e.getMessage());
			}
		}

		filterChain.doFilter(request, response);
	}
}