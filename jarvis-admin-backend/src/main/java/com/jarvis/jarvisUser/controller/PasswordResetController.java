//package com.jarvis.jarvisUser.controller;
//
//import com.jarvis.jarvisAdmin.service.UserService;
//import com.jarvis.jarvisUser.dto.ResetPasswordRequest;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:5173")
//public class PasswordResetController {
//
//    @Autowired
//    private UserService userService;
//
//    @PostMapping("/reset-password")
//    public Map<String, String> resetPassword(
//            @RequestBody ResetPasswordRequest request
//    ) {
//        userService.resetPasswordUsingToken(
//                request.getToken(),
//                request.getNewPassword()
//        );
//
//        return Map.of(
//                "status", "success",
//                "message", "Password reset successful"
//        );
//    }
//}
