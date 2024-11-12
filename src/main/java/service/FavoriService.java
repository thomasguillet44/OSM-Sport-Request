package service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import entity.Favori;
import entity.User;
import repository.FavoriRepository;
import repository.UserRepository;

@Service
public class FavoriService {
	
	@Autowired
	private FavoriRepository favoriRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	public boolean addFavorite(Favori favori) {
		if (!isAlreadyAdded(favori.getName())) {
			favoriRepository.save(favori);
			return true;
		}
		return false;
	}
	
	private boolean isAlreadyAdded(String name) {
		return (favoriRepository.findByName(name) != null);
	}

	public List<Favori> getFavoriByUserName(String userName) {
		List<Favori> favoriList = new ArrayList<>();
		Optional<User> userOpt = userRepository.findByUsername(userName);
		if (userOpt.isPresent()) {
			Long idUser = userOpt.get().getId();
			favoriList = favoriRepository.findAllByUserId(idUser);
		}
		return favoriList;
	}

}
