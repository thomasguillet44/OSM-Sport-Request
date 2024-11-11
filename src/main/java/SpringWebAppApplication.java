

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Les scan et enable c'est pour qu'au lancement de l'application on ait bien accès a toutes 
 * les classes du projet 
 */
@SpringBootApplication
@ComponentScan(basePackages = {"controller", "configuration", "service"})
@EnableJpaRepositories("repository")
@EntityScan("entity")   
public class SpringWebAppApplication 
{
    public static void main( String[] args )
    {
    	SpringApplication.run(SpringWebAppApplication.class, args);
    }
}
