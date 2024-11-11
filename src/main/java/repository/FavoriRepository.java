package repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import entity.Favori;

@Repository
public interface FavoriRepository extends JpaRepository<Favori, Long>{

	Favori findByName(String favoriName);
	List<Favori> findAllByUserId(Long userId);
	
}

