package com.jarvis.jarvisAdmin.controller;

import com.jarvis.jarvisAdmin.dto.LoginResponse;
import com.jarvis.jarvisAdmin.dto.UpdateProfileRequest;
import com.jarvis.jarvisAdmin.dto.AuthResponse;
import com.jarvis.jarvisAdmin.model.User;
import com.jarvis.jarvisAdmin.model.Role;
import com.jarvis.jarvisAdmin.service.UserService;
import com.jarvis.repository.AdminAuthRepository;
import com.jarvis.security.JwtUtil;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
       👑 CREATE ADMIN (SUPER ADMIN ONLY)
       ========================== */
    @PostMapping("/create")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createAdmin(@RequestBody User user) {
        return ResponseEntity.ok(userService.createAdmin(user));
    }

    /* ==========================
       🔐 LOGIN (JWT)
       ========================== */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User req) {

        Optional<User> userOpt =
                userRepository.findByUsername(req.getUsername())
                        .or(() -> userRepository.findByEmail(req.getUsername()));

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOpt.get();

        // 🔒 block disabled admins
        if (!user.isActive()) {
            return ResponseEntity.status(403).body("Account disabled");
        }

        boolean valid = userService.login(
                user.getUsername(),
                req.getPassword()
        );

        if (!valid) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // 🔑 JWT with REAL ROLE
        String token = JwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return ResponseEntity.ok(
                new LoginResponse(
                        true,
                        token,
                        user.getRole().name()
                )
        );
    }

    /* ==========================
       👤 PROFILE UPDATE (SELF ONLY)
       ========================== */
    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request
    ) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        Claims claims = JwtUtil.validateToken(token);

        String currentUsername = claims.getSubject();
        String role = claims.get("role", String.class);



        AuthResponse response =
                userService.updateProfile(currentUsername, request);

        return ResponseEntity.ok(response);
    }
    /* ==========================
   👀 LIST ALL ADMINS (SUPER ADMIN ONLY)
   ========================== */
    @GetMapping("/all")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getAllAdmins() {
        return ResponseEntity.ok(userRepository.findAll());
    }

}
