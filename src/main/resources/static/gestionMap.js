// Initialiser la carte
var map = L.map('map').setView([48.8566, 2.3522], 13); // Coordonnées pour Paris

var loadMap = function() {
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

window.onload = loadMap();