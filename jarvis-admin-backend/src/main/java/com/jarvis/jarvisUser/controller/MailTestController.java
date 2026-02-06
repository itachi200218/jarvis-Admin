package com.jarvis.jarvisUser.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class MailTestController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/api/test-mail")
    public String testMail() {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo("chetanyaadepu@gmail.com"); // send to yourself
        mail.setSubject("Test Mail from Jarvis Backend");
        mail.setText("If you received this, mail config is working ✅");

        mailSender.send(mail);

        return "Mail sent successfully";
    }
}
