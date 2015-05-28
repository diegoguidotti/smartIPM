
window.addEventListener("DOMContentLoaded", init, false);

function init(){	

	var html='';

	var url=	MashupPlatform.prefs.get("url");
	var latitude=	MashupPlatform.prefs.get("latitude");
	var longitude=	MashupPlatform.prefs.get("longitude");
	var start_date=	MashupPlatform.prefs.get("start_date");
	var end_date=	MashupPlatform.prefs.get("end_date");


	html+='Hi '+MashupPlatform.context.get("username")+"!<br/>";
	html+='<b>url:</b>'+url+'<br/>';
	html+='<b>coordinates:</b>'+latitude+' '+longitude+'<br/>';
	html+='<b>dates:</b>'+start_date+' - '+end_date+'<br/>';

	aWeatherVariable = Array('0 0 0');
	var options={
		'latitude': latitude,
		'longitude': longitude,
		'startTime': start_date,
		'endTime': end_date,
		'url': url,
		'weatherVariable': aWeatherVariable,
		'div_element': 'content'
	};
	
	runWSS(options);
// 	xml = makeXML(latitude, longitude, start_date, end_date, aWVar);
// 	console.log("aaaa");
// 	html+=xml;
// 	console.log("bbbb");
// 
// 	xmld = getWeatherData(url, xml);
//   jQuery(document).ajaxStop(function () {
// 		console.log("main");
// 		console.log(xmldata);
// 		val = jQuery(xmldata).find('values').text();
// 		
// 		aVal = CSV2array( val );
// 		
// 		html += array2Table( aVal );		
// 		console.log(aVal);
// 		jQuery('#content').html(html);
//   });	

	

	/*
	MashupPlatform.wiring.registerCallback("inputValue",function(val){
		jQuery('#aedit_input').val(val);
	});
	*/

}

/*
function doOutput(){	
	MashupPlatform.wiring.pushEvent('outputValue', jQuery('#aedit_input').val());
}
*/
