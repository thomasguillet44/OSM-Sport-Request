package configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import entity.User;
import repository.UserRepository;

/**
 * Class de configuration donc se lance quand l'application demarre, crée un utilisateur
 * par défaut pour éviter d'avoir à register a chaque fois
 */
@Configuration
public class UserConfig {

	@Bean
    public CommandLineRunner createDefaultUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("user") == null) {
                User defaultUser = new User();
                defaultUser.setUsername("user");
                defaultUser.setPassword(passwordEncoder.encode("pass"));
                defaultUser.setRole("USER");
                userRepository.save(defaultUser);
            }
        };
    }
	
}
