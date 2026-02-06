package com.jarvis.jarvisAdmin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import org.springframework.core.env.Environment;

@Service
@RequiredArgsConstructor
public class PasswordResetMailService {

    private final JavaMailSender mailSender;
    private final Environment env;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @PostConstruct
    public void debugMail() {
        System.out.println("MAIL USER = " + env.getProperty("spring.mail.username"));
        System.out.println("MAIL PASS = " + env.getProperty("spring.mail.password"));
    }

    public void sendResetMail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Reset Your Jarvis Password");
        message.setText("Reset link:\n" + resetLink);
        mailSender.send(message);
    }
}
