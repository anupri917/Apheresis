package com.bloodbank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetPasswordEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Apheresis - Password Reset Request");
        message.setText("To reset your password, please use the following token: " + token +
                        "\n\nThis token will expire in 2 minutes.\n\n" +
                        "If you did not request a password reset, please ignore this email.");
        mailSender.send(message);
    }
}