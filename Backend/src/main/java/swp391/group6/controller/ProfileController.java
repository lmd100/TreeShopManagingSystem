package swp391.group6.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.group6.dto.LoginResponse;
import swp391.group6.dto.ProfileResponse;
import swp391.group6.dto.ChangePasswordRequest;
import swp391.group6.dto.UserDTO;
import swp391.group6.service.ChangePasswordService;
import swp391.group6.service.UserService;
import swp391.group6.util.JWTUtil;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    private final ChangePasswordService changePasswordService;

    public ProfileController(UserService userService, ChangePasswordService changePasswordService) {
        this.userService = userService;
        this.changePasswordService = changePasswordService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(HttpServletRequest request) {

        LoginResponse jwtUser = JWTUtil.getUser(request);

        if (jwtUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
        }

        UserDTO user = userService.getUserByEmail(jwtUser.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        ProfileResponse response = new ProfileResponse(
                user.getEmail(),
                user.getFullName(),
                user.getPhone() != null ? user.getPhone() : "",
                Boolean.TRUE.equals(user.getStatus()),
                true
        );

        return ResponseEntity.ok(response);
    }
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody UserDTO userDTO,
                                           HttpServletRequest request) {

        LoginResponse jwtUser = JWTUtil.getUser(request);
        if (jwtUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid token");
        }

        UserDTO currentUser = userService.getUserByEmail(jwtUser.getEmail())
                .orElse(null);

        if (currentUser == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            UserDTO updatedUser = userService.updateProfile(currentUser.getId(), userDTO);

            if (updatedUser == null) {
                return ResponseEntity.notFound().build();
            }

            ProfileResponse response = new ProfileResponse(
                    updatedUser.getEmail(),
                    updatedUser.getFullName(),
                    updatedUser.getPhone() != null ? updatedUser.getPhone() : "",
                    Boolean.TRUE.equals(updatedUser.getStatus()),
                    true
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest,
                                            HttpServletRequest request) {
        LoginResponse currentUser = JWTUtil.getUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return switch (changePasswordService.changePassword(currentUser.getEmail(), changePasswordRequest)) {
            case SUCCESS -> ResponseEntity.ok().build();
            case WRONG_OLD_PASSWORD -> ResponseEntity.badRequest()
                    .body(Map.of("message", "Wrong old password"));
            case INVALID_INPUT -> ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid input"));
        };
    }
}
