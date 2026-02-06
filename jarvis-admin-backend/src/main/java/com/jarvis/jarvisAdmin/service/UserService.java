package com.jarvis.jarvisAdmin.service;

import com.jarvis.jarvisAdmin.model.User;
import com.jarvis.jarvisAdmin.dto.AuthResponse;
import com.jarvis.jarvisAdmin.dto.UpdateProfileRequest;

public interface UserService {

    /* ==========================
       ✅ REGISTER / SAVE
       ========================== */
    User save(User user);

    /* ==========================
       🔐 LOGIN (password check)
       ========================== */
    boolean login(String input, String password);

    /* ==========================
       🔑 JWT LOGIN
       ========================== */
    AuthResponse loginWithJwt(String input, String password);

    /* ==========================
       👤 UPDATE OWN PROFILE
       ========================== */
    AuthResponse updateProfile(
            String currentUsername,
            UpdateProfileRequest request
    );

    /* ==========================
       👑 SUPER ADMIN ACTIONS
       ========================== */

    // ➕ Create new ADMIN
    User createAdmin(User user);

    // ✏️ Update ADMIN (name / email)
    AuthResponse updateAdminBySuperAdmin(
            String adminId,
            UpdateProfileRequest request
    );

    // ❌ Delete ADMIN
    void deleteAdmin(String adminId);

    // 🔑 SUPER ADMIN – RESET ADMIN PASSWORD
    void resetAdminPassword(String adminId, String newPassword);
    /* ==========================
        📧 PASSWORD RESET (EMAIL)
        ========================== */
    void triggerPasswordResetEmail(String userId);
    /* ==========================
   🔐 PASSWORD RESET (TOKEN)
   ========================== */
//    void resetPasswordUsingToken(String token, String newPassword);

}
