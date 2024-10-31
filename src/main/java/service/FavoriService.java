package service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import entity.Favori;
import repository.FavoriRepository;

@Service
public class FavoriService {
	
	@Autowired
	private FavoriRepository favoriRepository;
	
	public void addFavorite(Favori favori) {
		if (!isAlreadyAdded(favori.getName())) {
			favoriRepository.save(favori);
		}
	}
	
	public List<Favori> getFavoriByUserId(Long userId) {
		List<Favori> result = favoriRepository.findAllByUserId(userId);
		return result;
	}
	
	private boolean isAlreadyAdded(String name) {
		return (favoriRepository.findByFavoriname(name) != null);
	}

}
