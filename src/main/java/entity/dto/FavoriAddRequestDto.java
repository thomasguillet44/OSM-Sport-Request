package entity.dto;

import lombok.Data;

@Data
public class FavoriAddRequestDto {
	private String lat;
    private String lon;
    private String userName;
    private String locName;	
}
