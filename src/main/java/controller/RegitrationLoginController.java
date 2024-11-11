package controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import entity.User;
import lombok.RequiredArgsConstructor;
import repository.UserRepository;

@Controller
@RequiredArgsConstructor
public class RegitrationLoginController {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	
	@GetMapping("/register")
    public String showRegistrationForm() {
        return "register";
    }
	
	 @GetMapping("/login")
	    public String showLoginForm() {
	        return "login";
	    }
	
	@PostMapping("/register")
	public String registration(@ModelAttribute("userName") String userName, 
			@ModelAttribute("password") String password) {
		if(userRepository.findByUsername(userName) != null) {
			return "redirect:register";
		}
		User user = new User();
		user.setUsername(userName);
		user.setRole("USER");
		user.setPassword(passwordEncoder.encode(password));
		userRepository.save(user);
		return "redirect:login";
	}
	
	@PostMapping("/login")
	public String loginUser(@ModelAttribute("userName") String userName, 
			@ModelAttribute("password") String password) {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userName, password));
			return "redirect:/home/" + userName;
		} catch (Exception e) {
			return "redirect:login";
		}
	}
	
	
}
