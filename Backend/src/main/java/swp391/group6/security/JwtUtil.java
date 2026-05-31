package swp391.group6.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String secret;
    private final long expiration;
    private final Algorithm algorithm;

    public JwtUtil(
            @Value("${JWT_SECRET}") String secret,
            @Value("${JWT_LIFETIME:86400000}") long expiration
    ) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET is not configured");
        }

        this.secret = secret;
        this.expiration = expiration;
        this.algorithm = Algorithm.HMAC256(secret);
    }

    public String generateToken(String email, String role) {
        Date now = new Date();

        return JWT.create()
                .withSubject(email)
                .withClaim("role", role)
                .withIssuedAt(now)
                .withExpiresAt(new Date(now.getTime() + expiration))
                .sign(algorithm);
    }

    public String extractEmail(String token) {
        return JWT.require(algorithm)
                .build()
                .verify(token)
                .getSubject();
    }

    public String extractRole(String token) {
        return JWT.require(algorithm)
                .build()
                .verify(token)
                .getClaim("role")
                .asString();
    }

    public boolean isValid(String token) {
        try {
            JWT.require(algorithm)
                    .build()
                    .verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}