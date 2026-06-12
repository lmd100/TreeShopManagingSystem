package swp391.group6.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import swp391.group6.dto.ChangePasswordRequest;
import swp391.group6.model.User;
import swp391.group6.repository.UserRepository;

@Service
public class ChangePasswordService {

    public enum Result {
        SUCCESS,
        WRONG_OLD_PASSWORD,
        INVALID_INPUT
    }

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ChangePasswordService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Result changePassword(String email, ChangePasswordRequest request) {
        if (request == null
                || request.getOldPassword() == null
                || request.getOldPassword().isBlank()
                || request.getNewPassword() == null
                || request.getNewPassword().length() < 6) {
            return Result.INVALID_INPUT;
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getPassword() == null) {
            return Result.INVALID_INPUT;
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return Result.WRONG_OLD_PASSWORD;
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return Result.SUCCESS;
    }
}
