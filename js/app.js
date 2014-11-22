// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

$(document).ready(function(){
	
	// Create the map elements
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };
	
	// Create the map
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });
	
	// Create the infoWindow
    var infoWindow = new google.maps.InfoWindow();
	
	// Create an array of markers as they are created
	var markers = [];
	
	// http://data.seattle.gov/resource/65fc-btcc.json
	// Get and process the list of traffic cameras from seattle.gov
    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) { // On Success
			// Iterate through camera list, add markers
            data.forEach(function(camera) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(camera.location.latitude),
                        lng: Number(camera.location.longitude)
                    },
                    map: map,
					title: camera.cameralabel
                });
				
				// Add the markers to the array of markers
				markers.push(marker);
				
				// Add listner, connecting marker to infoWindow
                google.maps.event.addListener(marker, 'click', function() {
                   var html = '<p>' + camera.cameralabel + '</p> <img src="' + camera.imageurl.url + '"/>';
                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                    map.panTo(marker.getPosition());
                });
            });
        })
        .fail(function(error) { // On failure
			// show error to user by either adding an element, or by showing an alert.
			alert('Failed to load the required map data');
        })
        .always(function() {
            $('#ajax-loader').fadeOut();
        }); // getJSON()

        // Filter the Markers When Searching
        $("#search").bind("search keyup", function() {
          	// store the value being searched for as a lower cased string
			var searchString = $(this).val().toLowerCase();
			// Parse the array of markers that are currently on the map
			for (var i = 0; i < markers.length; i++) {
				// Convert the current marker label to lowercase
				var markerLabel = markers[i].title.toLowerCase();
				// Is the search string present in the marker?
				if(markerLabel.indexOf(searchString) >= 0) {
					// If true, remove marker from map, otherwise do nothing
					markers[i].setVisible(true);
					//markers[i].setOpacity(1); // alternate display
				}else{
					// Otherwise hide the marker
					markers[i].setVisible(false);
					//markers[i].setOpacity(.25); // alternate display
				};
  			};
        });// $("#search").bind(...)
});// $(document).ready(function())
