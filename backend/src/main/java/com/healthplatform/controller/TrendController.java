package com.healthplatform.controller;

import com.healthplatform.dto.LabTrendDTO;
import com.healthplatform.model.User;
import com.healthplatform.repository.UserRepository;
import com.healthplatform.service.TrendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trends")
@RequiredArgsConstructor
public class TrendController {

    private final TrendService trendService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<LabTrendDTO>> getTrends(Authentication authentication, @RequestParam("parameter") String parameter) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        List<LabTrendDTO> trends = trendService.getParameterTrends(user.getId(), parameter);
        return ResponseEntity.ok(trends);
    }
}
