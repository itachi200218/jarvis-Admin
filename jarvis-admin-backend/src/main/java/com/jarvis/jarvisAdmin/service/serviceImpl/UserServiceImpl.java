package com.jarvis.jarvisAdmin.service.serviceImpl;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jarvis.jarvisAdmin.model.User;
import com.jarvis.jarvisAdmin.model.Role;
import com.jarvis.jarvisAdmin.model.PasswordResetToken;

import com.jarvis.jarvisAdmin.service.UserService;
import com.jarvis.jarvisAdmin.service.PasswordResetMailService;

import com.jarvis.jarvisAdmin.dto.AuthResponse;
import com.jarvis.jarvisAdmin.dto.UpdateProfileRequest;

import com.jarvis.repository.AdminAuthRepository;
import com.jarvis.repository.PasswordResetTokenRepository;
import com.jarvis.repository.JarvisUserRepository;

 // ✅ ADDED (only for mail)

import com.jarvis.security.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    // 🔹 EXISTING (UNCHANGED)
    @Autowired
    private AdminAuthRepository userRepository;

    // 🔹 ADDED ONLY FOR MAIL
    @Autowired
    private JarvisUserRepository jarvisUserRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordResetMailService passwordResetMailService;


    @Value("${userapp.frontend.url:http://localhost:5174}")
    private String userAppFrontendUrl;


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

        if (user.getRole() == null) {
            user.setRole(Role.ADMIN);
        }

        return userRepository.save(user);
    }

    @Override
    public User createAdmin(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.ADMIN);
        user.setActive(true);
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
    // 🔐 JWT LOGIN
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
                user.getRole().name()
        );

        return new AuthResponse(true, token);
    }

    // ==========================
    // 👤 PROFILE UPDATE
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

        String newToken = JwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return new AuthResponse(true, newToken);
    }

    // ==========================
    // 👑 SUPER ADMIN – UPDATE ADMIN
    // ==========================
    @Override
    public AuthResponse updateAdminBySuperAdmin(
            String adminId,
            UpdateProfileRequest req
    ) {

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() == Role.SUPER_ADMIN) {
            throw new RuntimeException("SUPER_ADMIN cannot be modified");
        }

        if (req.getUsername() != null && !req.getUsername().isBlank()) {
            admin.setUsername(req.getUsername());
        }

        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            admin.setEmail(req.getEmail());
        }

        userRepository.save(admin);

        return new AuthResponse(true, "Admin updated successfully");
    }

    // ==========================
    // 👑 SUPER ADMIN – DELETE ADMIN
    // ==========================
    @Override
    public void deleteAdmin(String adminId) {

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() == Role.SUPER_ADMIN) {
            throw new RuntimeException("SUPER_ADMIN cannot be deleted");
        }

        userRepository.deleteById(adminId);
    }

    // ==========================
    // 👑 SUPER ADMIN – FORCE RESET PASSWORD
    // ==========================
    @Override
    public void resetAdminPassword(String adminId, String newPassword) {

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() == Role.SUPER_ADMIN) {
            throw new RuntimeException("Cannot reset SUPER_ADMIN password");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        admin.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(admin);
    }


    /* ==========================
       📧 PASSWORD RESET – EMAIL
       (ONLY FIXED PART)
       ========================== */
    @Override
    public void triggerPasswordResetEmail(String userId) {

        System.out.println("DEBUG: reset password called for userId = " + userId);

        com.jarvis.jarvisUser.model.User user =
                jarvisUserRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("DEBUG: user email = " + user.getEmail());

        String token = UUID.randomUUID().toString();
        System.out.println("DEBUG: token generated");

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserId(userId);
        resetToken.setExpiry(LocalDateTime.now(IST).plusMinutes(15));

        passwordResetTokenRepository.save(resetToken);
        System.out.println("DEBUG: token saved");

        String resetLink =
                userAppFrontendUrl + "/reset-password?token=" + token;

        System.out.println("DEBUG: reset link = " + resetLink);

        try {
            passwordResetMailService.sendResetMail(user.getEmail(), resetLink);
            System.out.println("DEBUG: mail sent successfully");
        } catch (Exception e) {
            System.out.println("🔥 MAIL ERROR START 🔥");
            e.printStackTrace();
            System.out.println("🔥 MAIL ERROR END 🔥");
            throw e;
        }
    }
    /* ==========================
       🔐 PASSWORD RESET – USING TOKEN
       ========================== */
//    @Override
//    public void resetPasswordUsingToken(String token, String newPassword) {
//
//        if (newPassword == null || newPassword.length() < 6) {
//            throw new RuntimeException("Password must be at least 6 characters");
//        }
//
//        // 1️⃣ Find token
//        PasswordResetToken resetToken =
//                passwordResetTokenRepository.findByToken(token)
//                        .orElseThrow(() -> new RuntimeException("Invalid reset token"));
//
//        // 2️⃣ Check expiry
//        if (resetToken.getExpiry().isBefore(LocalDateTime.now(IST))) {
//            throw new RuntimeException("Reset token expired");
//        }
//
//        // 3️⃣ Get user
//        com.jarvis.jarvisUser.model.User user =
//                jarvisUserRepository.findById(resetToken.getUserId())
//                        .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // 4️⃣ Update password
//        user.setPassword(passwordEncoder.encode(newPassword));
//        jarvisUserRepository.save(user);
//
//        // 5️⃣ Delete token (VERY IMPORTANT)
//        passwordResetTokenRepository.delete(resetToken);
//    }

}
