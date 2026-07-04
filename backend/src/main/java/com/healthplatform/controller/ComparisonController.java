package com.healthplatform.controller;

import com.healthplatform.dto.ReportComparisonResponse;
import com.healthplatform.model.User;
import com.healthplatform.repository.UserRepository;
import com.healthplatform.service.ComparisonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/comparison")
@RequiredArgsConstructor
public class ComparisonController {

    private final ComparisonService comparisonService;
    private final UserRepository userRepository;

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestComparison(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        try {
            ReportComparisonResponse response = comparisonService.compareLatestWithPrevious(user.getId());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.ok(errorResponse); // Return HTTP 200 with message as requested
        }
    }
}
