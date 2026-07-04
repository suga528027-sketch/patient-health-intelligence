package com.healthplatform.controller;

import com.healthplatform.dto.TimelineResponse;
import com.healthplatform.model.User;
import com.healthplatform.repository.UserRepository;
import com.healthplatform.service.TimelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/timeline")
@RequiredArgsConstructor
public class ChatTimelineController {

    private final TimelineService timelineService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<TimelineResponse> getTimeline(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        TimelineResponse response = timelineService.getTimeline(user.getId());
        return ResponseEntity.ok(response);
    }
}
