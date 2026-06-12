package swp391.group6.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import swp391.group6.dto.UserDTO;
import swp391.group6.model.Role;
import swp391.group6.model.User;
import swp391.group6.repository.RoleRepository;
import swp391.group6.repository.UserRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final String DEFAULT_ROLE_NAME = "CUSTOMER";
    private static final String PROTECTED_ROLE_NAME = "SYSTEM_ADMIN";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> !hasRole(user, PROTECTED_ROLE_NAME))
                .map(this::convertToDTO)
                .toList();
    }

    public Optional<UserDTO> getUserById(long id) {
        return userRepository.findById(id)
                .filter(user -> !hasRole(user, PROTECTED_ROLE_NAME))
                .map(this::convertToDTO);
    }

    public UserDTO createUser(UserDTO userDTO) {
        validateUserForCreate(userDTO);

        if (userRepository.findByEmail(userDTO.getEmail().trim()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail().trim());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setFullName(userDTO.getFullName().trim());
        user.setPhone(normalizePhone(userDTO.getPhone()));
        user.setRole(resolveRole(userDTO.getRoleName()));
        user.setStatus(userDTO.getStatus() == null || userDTO.getStatus());
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return convertToDTO(userRepository.save(user));
    }

    public UserDTO updateUser(long id, UserDTO userDTO) {
        if (userDTO == null) {
            throw new IllegalArgumentException("User data is required");
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null || hasRole(user, PROTECTED_ROLE_NAME)) {
            return null;
        }

        if (userDTO.getFullName() != null) {
            validateFullName(userDTO.getFullName());
            user.setFullName(userDTO.getFullName().trim());
        }
        if (userDTO.getPhone() != null) {
            user.setPhone(normalizePhone(userDTO.getPhone()));
        }
        if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
            validatePassword(userDTO.getPassword());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        if (userDTO.getRoleName() != null && !userDTO.getRoleName().isBlank()) {
            user.setRole(resolveRole(userDTO.getRoleName()));
        }
        if (userDTO.getStatus() != null) {
            user.setStatus(userDTO.getStatus());
        }

        return convertToDTO(userRepository.save(user));
    }

    public UserDTO updateProfile(long id, UserDTO userDTO) {
        if (userDTO == null) {
            throw new IllegalArgumentException("User data is required");
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }

        if (userDTO.getFullName() != null) {
            validateFullName(userDTO.getFullName());
            user.setFullName(userDTO.getFullName().trim());
        }
        if (userDTO.getPhone() != null) {
            user.setPhone(normalizePhone(userDTO.getPhone()));
        }

        return convertToDTO(userRepository.save(user));
    }

    public boolean deleteUser(long id) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isEmpty() || hasRole(existingUser.get(), PROTECTED_ROLE_NAME)) {
            return false;
        }
        userRepository.delete(existingUser.get());
        return true;
    }

    public UserDTO banUser(long id) {
        return updateUserStatus(id, false);
    }

    public UserDTO unbanUser(long id) {
        return updateUserStatus(id, true);
    }

    public List<UserDTO> searchUsers(String query) {
        return userRepository.search(query).stream()
                .filter(user -> !hasRole(user, PROTECTED_ROLE_NAME))
                .map(this::convertToDTO)
                .toList();
    }

    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .filter(user -> !hasRole(user, PROTECTED_ROLE_NAME))
                .map(this::convertToDTO);
    }

    public Optional<UserDTO> getUserByEmailUnprotected(String email) {
        return userRepository.findByEmail(email).map(this::convertToDTO);
    }

    private UserDTO updateUserStatus(long id, boolean status) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null || hasRole(user, PROTECTED_ROLE_NAME)) {
            return null;
        }
        user.setStatus(status);
        return convertToDTO(userRepository.save(user));
    }

    private Role resolveRole(String roleName) {
        String requestedRole = roleName == null || roleName.isBlank()
                ? DEFAULT_ROLE_NAME
                : roleName.trim();
        if (PROTECTED_ROLE_NAME.equalsIgnoreCase(requestedRole)) {
            throw new IllegalArgumentException("System admin role cannot be assigned");
        }
        return roleRepository.findByNameIgnoreCase(requestedRole)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));
    }

    private void validateUserForCreate(UserDTO userDTO) {
        if (userDTO == null) {
            throw new IllegalArgumentException("User data is required");
        }
        if (userDTO.getEmail() == null
                || !userDTO.getEmail().trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Valid email is required");
        }
        validateFullName(userDTO.getFullName());
        validatePassword(userDTO.getPassword());
        normalizePhone(userDTO.getPhone());
    }

    private void validateFullName(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
    }

    private String normalizePhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return null;
        }
        String normalized = phone.replaceAll("\\s+", "");
        if (!normalized.matches("^0\\d{8,10}$")) {
            throw new IllegalArgumentException("Invalid phone number");
        }
        return normalized;
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setRoleName(user.getRole() == null ? null : user.getRole().getName());
        dto.setStatus(user.isStatus());
        dto.setCreatedAt(user.getCreatedAt() == null ? null : user.getCreatedAt().toString());
        return dto;
    }

    private boolean hasRole(User user, String roleName) {
        return user.getRole() != null && roleName.equalsIgnoreCase(user.getRole().getName());
    }
}
