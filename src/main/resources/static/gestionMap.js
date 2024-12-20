// Initialiser la carte
var map = L.map('map').setView([0, 0], 13); // Coordonnées pour Paris

var latCurrentLocation;
var longCurrentLocation;

var latSelectedLocation;
var longSelectedLocation;
var nameSelectedLocation;

let dataLoaded= false;

var loadMap = function() {		
		centerMapOnCurrentLocation();
	    // Ajouter la couche de carte OSM
	    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	        maxZoom: 20,
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	    }).addTo(map);

	    var osmData = /*[[${osmData}]]*/ '[]';

	    var data = JSON.parse(osmData);
	    if (data.length > 0) {
	        var lat = data[0].lat;
	        var lon = data[0].lon;
	        var name = data[0].display_name;

	        // Ajouter le marqueur
	        var marker = L.marker([lat, lon]).addTo(map);
	        marker.bindPopup('<b>' + name + '</b>').openPopup();
	        map.setView([lat, lon], 16); // Centrer la carte sur le marqueur
	    }
}

var markers = [];

var actualiserMap = async function() {
	
	document.getElementById('loadingBarContainer').style.display = 'block';
	document.getElementById('loadingBar').style.width = '0';
	
	// Récupérer les coordonnées de la carte visible
	    var bounds = map.getBounds();
	    var northEast = bounds.getNorthEast();
	    var southWest = bounds.getSouthWest();
		
		var checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
		var sportFilter = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);
	    
	    var queryInit = `
	    [out:json][timeout:5];
	    (`;
		  
		var queryCoordonates = `(${southWest.lat}, ${southWest.lng}, ${northEast.lat}, ${northEast.lng});`;
		
	    var queryFilteredSports = "";
		sportFilter.forEach(sport => queryFilteredSports += "nwr[sport=" + sport + "]" + queryCoordonates);
		
		var finalQuery = queryInit + (queryFilteredSports || "nwr[leisure]" + queryCoordonates) + `);out body;`;
		
		try {
			// Appel à l'API Overpass
			const response = await fetch('https://overpass-api.de/api/interpreter', {
				method: 'POST',
				body: finalQuery,
				headers: {
				 	 'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
					
			const data = await response.json();
					
			updateMapWithData(data);
					
			if (!response.ok) {
				throw new Error("La requete OSM a échoué");
			}
		} catch(error) {
			console.error("Erreur :", error);
		} 
		
		finally {
			document.getElementById('loadingBarContainer').style.display = 'none';
		}		
	    
}

var updateMapWithData = function(data) {
    
	clearMarkers();
	
    data.elements.forEach(element => {
        var marker = L.marker([element.lat, element.lon]).addTo(map)
                .bindPopup(miseEnFormeTag(element.tags));
		marker.addEventListener('click', function() {
			var name = element.tags["name"];
			var nameContainer = document.querySelector("#nameOfThePlace");
			nameContainer.innerHTML = name || "Aucun trouvé pour cette structure";
			
			latSelectedLocation = element.lat;
			longSelectedLocation = element.lon;
			nameSelectedLocation = name || "Aucun trouvé pour cette structure";
			
			var buttonGetToThere = document.querySelector("#getToThisPoint");
			buttonGetToThere.disabled = false;
			
			var buttonAddToFavourite = document.querySelector("#addToFavourite");
			buttonAddToFavourite.disabled = false;
		})
		markers.push(marker);
    });
}

var miseEnFormeTag = function(tags) {
	var htmlToShow = ""; 
	for(tag in tags) {
		if (tag != "leisure" && tag != "check_date") {
			htmlToShow = htmlToShow + tag + " : " + tags[tag] + "<br>";
		}
	}
	return htmlToShow;
}

var clearMarkers = function() {
	markers.forEach(marker => {
	       map.removeLayer(marker); // Supprimer chaque marqueur de la carte
	   });
	   markers = []; // Réinitialiser le tableau de marqueurs
}


// Fonction pour centrer la carte sur la localisation actuelle
var centerMapOnCurrentLocation = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
				console.log(position.coords);
                const { latitude, longitude } = position.coords;
				latCurrentLocation = position.coords.latitude;
				longCurrentLocation = position.coords.longitude;
                map.setView([latitude, longitude], 13); // Centrer la carte
                L.marker([latitude, longitude], {icon : iconCurrentLocation}).addTo(map);
            },
            error => {
                map.setView([47.218102,-1.552800], 13);
            }
        );
    } else {
        map.setView([47.218102,-1.552800], 13);
    }
}

var showItinerary = function() {	
	map.eachLayer(layer => {
	  if (layer.options.waypoints && layer.options.waypoints.length) {
	    this.map.removeLayer(layer);
	   }
	});
	
	L.Routing.control({
		waypoints: [
			L.latLng(latCurrentLocation, longCurrentLocation),
			L.latLng(latSelectedLocation, longSelectedLocation)
		]
	}).addTo(map);
}

//fonction async pour pouvoir ajouter en dynamique les favoris sans avoir a recharger toute la page
var addToFavourite = async function() {
	let params = new URLSearchParams(window.location.search);
	let data = {
	    lat: latSelectedLocation,
	    lon: longSelectedLocation,
	    userName: params.get('userName'),
	    locName: nameSelectedLocation
	};
	try {
		const response = await 	fetch('/addFavori', {
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json'
		    },
		    body: JSON.stringify(data)
		});
		if(response.ok) {
			loadFavoris();
			showPopup("Favori ajouté avec succès !");
		} else {
			const errorData = await response.json();
			showPopup(errorData.message, true);
		}
	} catch(error) {
		const errorData = await error.json();
		showPopup(errorData.message, true);
	}
}

var loadFavoris = async function() {
	let params = new URLSearchParams(window.location.search);
	let userName = params.get('userName');
	let urlToGet = '/getFavori/' + userName;
	const response = await fetch(urlToGet);
	
	const favoris = await response.json();
	const favorisTable = document.getElementById('favorisTable');
	favorisTable.innerHTML = '';
	favoris.forEach(favori => {
	      favorisTable.innerHTML += `
	         <tr>
	           <td>${favori.name}</td>
	         </tr>`;
	});
}
	
var showPopup = function(message, isError = false) {
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;
    popupMessage.className = isError ? 'error' : '';
    popupMessage.style.display = 'block';
    popupMessage.style.opacity = '1';

	//pour gerer l'affichage temporaire de la popup
    setTimeout(() => {
        popupMessage.style.opacity = '0';
        setTimeout(() => popupMessage.style.display = 'none', 500);
    }, 3000);
}

iconCurrentLocation = L.divIcon({
        className: 'custom-div-icon',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="red" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
		  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
		</svg>`,
		iconAnchor: [13, 13]
    });
    


window.onload = loadMap();
window.onload = loadFavoris();