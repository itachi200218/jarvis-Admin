package com.jarvis.jarvisAdmin.service.serviceImpl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jarvis.jarvisAdmin.model.User;
import com.jarvis.jarvisAdmin.model.Role; // ✅ ADDED
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
    // ✅ REGISTER (UNCHANGED)
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

        // ✅ ENSURE ROLE EXISTS (IMPORTANT)
        if (user.getRole() == null) {
            user.setRole(Role.ADMIN);
        }

        return userRepository.save(user);
    }

    @Override
    public User createAdmin(User user) {

        // 🔒 prevent duplicates
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // 🔐 hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 👑 force ADMIN role (SUPER_ADMIN creates ADMIN only)
        user.setRole(Role.ADMIN);

        // ✅ enable account
        user.setActive(true);

        // ⏰ timestamps
        user.setCreatedAt(LocalDateTime.now(IST));

        return userRepository.save(user);
    }


    // ==========================
    // ✅ LOGIN (UNCHANGED)
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
    // 🔐 JWT LOGIN (SUPER ADMIN READY)
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

        // ✅ ROLE IS DYNAMIC (ADMIN / SUPER_ADMIN)
        String token = JwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return new AuthResponse(true, token);
    }

    // ==========================
    // 👤 PROFILE UPDATE (SUPER ADMIN SAFE)
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

        // 🔁 TOKEN WITH REAL ROLE
        String newToken = JwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return new AuthResponse(true, newToken);
    }
}
