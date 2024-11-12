package controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import entity.Favori;
import entity.User;
import entity.dto.FavoriAddRequestDto;
import repository.UserRepository;
import service.FavoriService;

@RestController
public class FavoriController {

	@Autowired
	private FavoriService favoriService;

	@Autowired
	private UserRepository userRepository;

	@PostMapping("/addFavori") 
	public ResponseEntity<Map<String, String>> addFavori(@RequestBody FavoriAddRequestDto request) {
		double lat = Double.parseDouble(request.getLat());
		double lon = Double.parseDouble(request.getLon());
		String userName = request.getUserName();
		String locName = request.getLocName();

		Optional<User> user = userRepository.findByUsername(userName);

		if (user.isPresent()) {
			Favori favoriToAdd = new Favori();
			favoriToAdd.setLatitude(lat);
			favoriToAdd.setLongitude(lon);
			favoriToAdd.setName(locName);
			Long idUser = user.get().getId();
			favoriToAdd.setUserId(idUser);
			if (this.favoriService.addFavorite(favoriToAdd)) {
				ResponseEntity<Map<String, String>> responseOk = ResponseEntity.ok(Map.of("message","Elément ajouté dans vos favoris"));
				return responseOk;
			} else {
				ResponseEntity<Map<String, String>> responseError = ResponseEntity.status(HttpStatus.BAD_REQUEST)
					    .body(Map.of("message", "Favoris déjà présent"));
				return responseError;
			}
		}
		
		ResponseEntity<Map<String, String>> responseError = ResponseEntity.status(HttpStatus.BAD_REQUEST)
			    .body(Map.of("message", "Erreur lors de l'ajout"));
		return responseError;
	}
	
	@GetMapping("/getFavori/{userName}")
    public List<Favori> getFavoris(@PathVariable String userName) {
        return favoriService.getFavoriByUserName(userName);
    }

}
