package com.healthplatform.service;

import com.healthplatform.dto.LoginRequest;
import com.healthplatform.dto.LoginResponse;
import com.healthplatform.dto.RegisterRequest;
import com.healthplatform.dto.UserInfo;
import com.healthplatform.model.PatientProfile;
import com.healthplatform.model.Role;
import com.healthplatform.model.User;
import com.healthplatform.repository.PatientProfileRepository;
import com.healthplatform.repository.UserRepository;
import com.healthplatform.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public UserInfo register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.PATIENT);
        User savedUser = userRepository.save(user);

        PatientProfile profile = new PatientProfile();
        profile.setUser(savedUser);
        patientProfileRepository.save(profile);

        return new UserInfo(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole().name());
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        UserInfo userInfo = new UserInfo(user.getId(), user.getName(), user.getEmail(), user.getRole().name());

        return new LoginResponse(token, userInfo);
    }
}
