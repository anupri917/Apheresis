package com.bloodbank.service;

import com.bloodbank.entity.User;
import com.bloodbank.repository.UserRepository;
import com.bloodbank.security.JwtUtils;
import com.bloodbank.util.EncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EncryptionUtil encryptionUtil;

    @Autowired
    private EmailService emailService;

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));


        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (user.getLastResetAttempt() != null &&
            user.getLastResetAttempt().toLocalDate().equals(now.toLocalDate())) {
            if (user.getResetAttempts() >= 5) {
                throw new RuntimeException("Maximum password reset attempts (5) reached for today. Try again tomorrow.");
            }
            user.setResetAttempts(user.getResetAttempts() + 1);
        } else {
            user.setResetAttempts(1);
        }
        user.setLastResetAttempt(now);

        String token = java.util.UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setTokenExpiry(now.plusMinutes(2));
        userRepository.save(user);

        emailService.sendResetPasswordEmail(email, token);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (java.time.LocalDateTime.now().isAfter(user.getTokenExpiry())) {
            throw new RuntimeException("Reset token has expired (2 minute limit)");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);
    }

    public Map<String, String> login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        final String jwt = jwtUtils.generateToken(userDetails);

        User user = userRepository.findByUsername(username).orElseThrow();

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("role", user.getRole());
        response.put("username", user.getUsername());
        return response;
    }

    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if ("ROLE_ADMIN".equals(user.getRole())) {
            if (userRepository.countByRole("ROLE_ADMIN") >= 10) {
                throw new RuntimeException("Registration failed: Maximum number of Admin accounts (10) has been reached.");
            }
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getGovernmentId() != null) {
            user.setGovernmentId(encryptionUtil.encrypt(user.getGovernmentId()));
        }

        return userRepository.save(user);
    }
}