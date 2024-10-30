// Initialiser la carte
var map = L.map('map').setView([0, 0], 13); // Coordonnées pour Paris

var latCurrentLocation;
var longCurrentLocation;

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

var actualiserMap = function() {
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
		
	    // Appel à l'API Overpass
	    fetch('https://overpass-api.de/api/interpreter', {
	        method: 'POST',
	        body: finalQuery,
	        headers: {
	            'Content-Type': 'application/x-www-form-urlencoded'
	        }
	    })
	    .then(response => response.json())
	    .then(data => {
	        // Traiter les données et mettre à jour la carte
	        updateMapWithData(data);
	    })
	    .catch(error => {
	        console.error('Erreur lors de la récupération des données :', error);
	    });
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
			
			var buttonGetToThere = document.querySelector("#getToThisPoint");
			buttonGetToThere.disabled = false;
			
			buttonGetToThere.dataset.lat = element.lat;
			buttonGetToThere.dataset.lon = element.lon;
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

var showItinerary = function(button) {
	var latitude = button.dataset.lat;
	var longitude = button.dataset.lon;
	
	map.eachLayer(layer => {
	  if (layer.options.waypoints && layer.options.waypoints.length) {
	    this.map.removeLayer(layer);
	   }
	});
	
	L.Routing.control({
		waypoints: [
			L.latLng(latCurrentLocation, longCurrentLocation),
			L.latLng(latitude, longitude)
		]
	}).addTo(map);
}

iconCurrentLocation = L.divIcon({
        className: 'custom-div-icon',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="red" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
		  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
		</svg>`,
		iconAnchor: [13, 13]
    });
    


window.onload = loadMap();