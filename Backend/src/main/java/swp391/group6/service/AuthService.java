package swp391.group6.service;

import swp391.group6.dto.LoginRequest;
import swp391.group6.dto.LoginResponse;
import swp391.group6.model.User;
import swp391.group6.repository.UserRepository;
import swp391.group6.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword()))
            return null;

        if (!user.isStatus())
            return null;

        String role = user.getRole() != null ? user.getRole().getName() : "CUSTOMER";
        String token = jwtUtil.generateToken(user.getEmail(), role);

        return new LoginResponse(token, user.getEmail(), user.getFullName(), role);
    }
}