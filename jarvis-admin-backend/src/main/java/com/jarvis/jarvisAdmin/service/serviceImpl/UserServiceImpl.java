package com.jarvis.jarvisAdmin.service.serviceImpl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jarvis.jarvisAdmin.model.User;
import com.jarvis.jarvisAdmin.service.UserService;
import com.jarvis.jarvisAdmin.dto.AuthResponse;
import com.jarvis.jarvisAdmin.dto.UpdateProfileRequest;
import com.jarvis.repository.AdminAuthRepository;
import com.jarvis.security.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private AdminAuthRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");

    // ==========================
    // ✅ REGISTER (NO CHANGE)
    // ==========================
    @Override
    public User save(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now(IST));

        return userRepository.save(user);
    }

    // ==========================
    // ✅ LOGIN (NO CHANGE)
    // ==========================
    @Override
    public boolean login(String input, String password) {

        Optional<User> userOpt =
                userRepository.findByUsername(input)
                        .or(() -> userRepository.findByEmail(input));

        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        boolean match = passwordEncoder.matches(password, user.getPassword());

        if (match) {
            user.setLastLoginAt(LocalDateTime.now(IST));
            userRepository.save(user);
        }

        return match;
    }

    // ==========================
    // 🔐 JWT LOGIN (NEW)
    // ==========================
    @Override
    public AuthResponse loginWithJwt(String input, String password) {

        Optional<User> userOpt =
                userRepository.findByUsername(input)
                        .or(() -> userRepository.findByEmail(input));

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        user.setLastLoginAt(LocalDateTime.now(IST));
        userRepository.save(user);

        String token = JwtUtil.generateToken(
                user.getUsername(),
                "ADMIN"
        );

        return new AuthResponse(true, token);
    }

    // ==========================
    // 👤 PROFILE UPDATE (NEW)
    // ==========================
    @Override
    public AuthResponse updateProfile(
            String currentUsername,
            UpdateProfileRequest req
    ) {

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.getUsername() != null && !req.getUsername().isBlank()) {
            user.setUsername(req.getUsername());
        }

        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            user.setEmail(req.getEmail());
        }

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        userRepository.save(user);

        // 🔁 NEW TOKEN AFTER UPDATE
        String newToken = JwtUtil.generateToken(
                user.getUsername(),
                "ADMIN"
        );

        return new AuthResponse(true, newToken);
    }
}
