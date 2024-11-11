package configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;
import service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomUserDetailsService userDetailsService;
	
	private final CustomSecurityLoginSuccessHandler successHandler;

	/**
	 * Filtrer les requetes http pour autoriser seulement les requetes de connexion
	 * @param http
	 * @return
	 * @throws Exception
	 */
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws  Exception {
		http
		.csrf(csrf -> csrf.disable())
		.authorizeHttpRequests(auth -> auth
				.requestMatchers("/login", "/register", "/h2-console/**",
						"/loginStyle.css", "/registerStyle.css").permitAll()
				.anyRequest().authenticated()
				)
		.formLogin(form -> form
				.loginPage("/login")
				.successHandler(successHandler)
				.permitAll()
				.failureUrl("/login?error=true")
				)
		.headers(headers -> headers.disable()) //pour avoir acces à H2
		.logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );

		return http.build();
	}

	/**
	 * On crée le Bean passwordEncoder qu'on va ensuite appeler depuis le controler
	 * @return
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	/**
	 * On crée le Bean authenticationManager qu'on va ensuite appeler depuis le controler, 
	 * par la methode authenticate
	 * @return
	 */
	@Bean 
	public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception{
		AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
		authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
		return authenticationManagerBuilder.build();
	}
}
