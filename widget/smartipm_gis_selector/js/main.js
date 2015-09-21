
window.addEventListener("DOMContentLoaded", init, false);

var map, marker;

function init(){	

// 
	var latitude=	MashupPlatform.prefs.get("latitude");
	var longitude=	MashupPlatform.prefs.get("longitude");
	var zoom=	MashupPlatform.prefs.get("zoom");
	username = MashupPlatform.context.get("username");

	debug('start'+latitude+longitude);
		map= L.map('map', { zoomControl:false }).setView([latitude,longitude], zoom);
		
		var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		subDomains = ['otile1','otile2','otile3','otile4'],
		mapquestAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.';
		var mapquest = new L.TileLayer(mapquestUrl, {maxZoom: 17, attribution: mapquestAttrib, subdomains: subDomains});
		map.addLayer(mapquest); 

		

		map.on('click', function(e){

			debug('click');


			if(marker){
				map.removeLayer(marker);
			}
			marker = new L.marker(e.latlng).addTo(map);	

			var coo=	e.latlng.lat+"|"+e.latlng.lng;
			MashupPlatform.wiring.pushEvent('coordinates', coo);
		});


		MashupPlatform.widget.context.registerCallback(function (new_values) {
			debug('callback');
			map.invalidateSize();
			jQuery.each(new_values, function(k,v){
				console.log(k+" "+v);
			});
			
		  //if ('heightInPixels' in new_values) {
			//		map.invalidateSize();
		  //}
		});
}


function debug(t){
	jQuery('#debug').append(t+"<br/>")
}


