package service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import entity.User;
import lombok.RequiredArgsConstructor;
import repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{

	private final UserRepository userRepository;
	
	 private List<GrantedAuthority> getAuthority(String role) {
	        return Collections.singletonList(new SimpleGrantedAuthority(role));
	    }
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> userOptional = userRepository.findByUsername(username);
		if(userOptional.isEmpty()) {
			throw new UsernameNotFoundException("utilisateur introuvable");
		}
		
		User user = userOptional.get();
		
		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), 
				this.getAuthority(user.getRole()));
	}

}
