package swp391.group6.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "your-secret-key";
    private final long EXPIRATION = 86400000; // 24 hours

    public String generateToken(String email, String role) {
        return JWT.create()
                .withSubject(email)
                .withClaim("role", role)
                .withIssuedAt(Instant.now())
                .withExpiresAt(Instant.now().plusSeconds(EXPIRATION)))
                .sign(Algorithm.HMAC256(SECRET));
    }
}
