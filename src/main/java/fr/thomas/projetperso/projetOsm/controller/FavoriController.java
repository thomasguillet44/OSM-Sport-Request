package fr.thomas.projetperso.projetOsm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import entity.Favori;
import service.FavoriService;

@Controller
public class FavoriController {
	
	@Autowired
	private FavoriService favoriService;
	
	@GetMapping("/{userId}/favori")
	public ModelAndView showFavori(@PathVariable String userId) {
		ModelAndView result = new ModelAndView();
		Long userIdLong = Long.parseLong(userId);
		List<Favori> listFavori = favoriService.getFavoriByUserId(userIdLong);
		result.addObject("listFavori", listFavori);
		return result;
	}
	
	@PostMapping("{userId}/addFavori") 
	public ResponseEntity<String> addFavori(@PathVariable String userId) {
		ResponseEntity<String> responseOk = ResponseEntity.ok("Elément ajouté dans vos favoris");
		return responseOk;
	}

}
