package controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import entity.Favori;
import service.FavoriService;

@Controller
public class HomeController {

	@Autowired
	private FavoriService favoriService;
	
	@GetMapping("/home")
	public ModelAndView homePage(@RequestParam String userName) {
		ModelAndView result = new ModelAndView("home");
		result.addObject("userName", userName);
		
		List<Favori> listFavori = favoriService.getFavoriByUserName(userName);
		result.addObject("listFavori", listFavori);
		
		return result;

	}

//	private boolean isAuthenticated() {
//		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//		if (authentication == null || AnonymousAuthenticationToken.class.
//				isAssignableFrom(authentication.getClass())) {
//			return false;
//		}
//		return authentication.isAuthenticated();
//	}

}
