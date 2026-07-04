package com.healthplatform.controller;

import com.healthplatform.dto.ChatRequest;
import com.healthplatform.dto.ChatResponse;
import com.healthplatform.model.User;
import com.healthplatform.repository.UserRepository;
import com.healthplatform.service.RagChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final RagChatService ragChatService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(Authentication authentication, @RequestBody ChatRequest request) {
        // Resolve patientId from the JWT authentication to ensure security boundary
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        ChatResponse response = ragChatService.chat(request.getMessage(), user.getId());
        return ResponseEntity.ok(response);
    }
}
