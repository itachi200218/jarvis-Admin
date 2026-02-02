package com.jarvis.jarvisAdmin.controller;

import com.jarvis.jarvisAdmin.dto.LoginResponse;
import com.jarvis.jarvisAdmin.dto.UpdateProfileRequest;
import com.jarvis.jarvisAdmin.dto.AuthResponse;
import com.jarvis.jarvisAdmin.model.User;
import com.jarvis.jarvisAdmin.service.UserService;
import com.jarvis.repository.AdminAuthRepository;
import com.jarvis.security.JwtUtil;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/admin/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminAuthRepository userRepository;

    /* ==========================
       ✅ REGISTER (PUBLIC)
       ========================== */
    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.save(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /* ==========================
       🔐 LOGIN (JWT)
       ========================== */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User req) {

        boolean valid = userService.login(
                req.getUsername(),
                req.getPassword()
        );

        if (!valid) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // 🔍 Resolve real user (username OR email)
        Optional<User> userOpt =
                userRepository.findByUsername(req.getUsername())
                        .or(() -> userRepository.findByEmail(req.getUsername()));

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("User not found");
        }

        User user = userOpt.get();

        // 🔑 Generate JWT
        String token = JwtUtil.generateToken(
                user.getUsername(),
                "ADMIN"
        );

        return ResponseEntity.ok(
                new LoginResponse(true, token)
        );
    }

    /* ==========================
       👤 PROFILE UPDATE (JWT)
       ========================== */
    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request
    ) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.replace("Bearer ", "");

        Claims claims = JwtUtil.validateToken(token);
        String currentUsername = claims.getSubject();

        AuthResponse response =
                userService.updateProfile(currentUsername, request);

        return ResponseEntity.ok(response);
    }
}
