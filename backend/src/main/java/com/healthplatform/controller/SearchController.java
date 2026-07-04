package com.healthplatform.controller;

import com.healthplatform.dto.SearchResponseDTO;
import com.healthplatform.model.User;
import com.healthplatform.repository.UserRepository;
import com.healthplatform.service.SearchService;
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
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<SearchResponseDTO>> search(Authentication authentication, @RequestParam("q") String query) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        List<SearchResponseDTO> results = searchService.search(query, user.getId());
        return ResponseEntity.ok(results);
    }
}
