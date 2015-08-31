
function testModelManager(){
	var options = {
		'url': '/smartIPM/api/model-manager',
		'div_element':'#test_model_manager'
	};
	runModelManager(options);
}


//simple test on test api
function searchStation(){

	var search_filter={"simpleRequestMessage": {
		"longitude": jQuery('#lon').val(), 
		"latitude": jQuery('#lat').val(), 
		"distance":jQuery('#distance').val()}
	};

	jQuery.ajax({
		  url: 'api/weather',
		  type: 'POST',
		  contentType: 'application/json',
		  dataType: 'json',
			data: JSON.stringify(search_filter),
		  success: function(data){
				console.log(data);
				var opt='';
				jQuery.each(data.weather_stations, function(k,v){
					opt+="<option value='"+v.id_weather_station+"'>"+v.station_name+"</option>";
				});

				jQuery('#choose_stat').html(opt);
				console.log(data);
		  },
		  error: function(e){
				console.log("Error");
				console.log(e);
		  },
		  //processData: false,
	});


}



function showWeatherData(){

	var id_weather_station=jQuery('#choose_stat').val();

	jQuery.ajax({
		  url: 'api/weather/'+id_weather_station,
		  type: 'POST',
		  contentType: 'application/json',
		  dataType: 'json',			
		  success: function(data){
				console.log(data);
				var tr='';
				if(data.weather_data.length==0){
					tr+='<tr><th>There are no data</th></tr>';
				}
				else{
					jQuery.each(data.weather_data, function(k,v){
						tr+="<tr><th>"+v.time_ref+"</th><td>"+v.tavg+"</td></tr>";
					});
				}
				jQuery('#weather_data').html(tr);
				console.log(data);
		  },
		  error: function(e){
				console.log("Error");
				console.log(e);
		  },
		  //processData: false,
	});


}


//simple test on test api
function testDiego(){

	jQuery.ajax({
		  url: 'api/diego/1/1',
		  type: 'POST',
		  contentType: 'application/json',
		  dataType: 'json',
			data: JSON.stringify({ "parola_chiave": "pippo" }),
		  success: function(data){
				console.log(data);
		  },
		  error: function(e){
				console.log("Error");
				console.log(e);
		  },
		  //processData: false,
	});


}




function runModelManager(options){
	
	var div_element='#test_model_manager';
	console.log(options);
	if(options.div_element){
		div_element=options.div_element;
	}
	url = options.url;
	
	xml = getXMLModelManager(options);
	
	xmld = getModelManagerData(url, xml);

  jQuery(document).ajaxStop(function () {
		console.log("runModelManager");
		console.log(xmldata);
		
		html = "";
		html += "<table border='1'>";
		html += "<thead><th>ID</th><th>Model Name</th><th>Model Descr</th><th>Crop Name</th><th>Pest Name</th></thead>";
		html += "<tbody>";
		jQuery(xmldata).find('model').each(function (k,v){
			console.log(v);
			v = jQuery(v);
			html += "<tr>";
			html += "<td>"+v.find('id').text()+"</td>";
			html += "<td>"+v.find('model_name').text()+"</td>";
			html += "<td>"+v.find('model_description').text()+"</td>";
			html += "<td>"+v.find('crop').find('crop_name').text()+"</td>";
			html += "<td>"+v.find('pest').find('pest_name').text()+"</td>";
			html += "</tr>";
		});
		html += "</tbody>";
		html += "</table>";
		jQuery(div_element).html(html);
  });	
}



/////////////////////////////////////////////////////////////////////////////
// testApi
// ======================
// This function shows the weather data getted from the function showWeatherData()
/**
*/
function testApi(){

	console.log('api');

	var html="<input name='lat' id='lat' value='43.664891' /> ";
	html+="<input name='lon' id='lon' value='10.632267' /> ";
	html+="<input name='distance' id='distance' value='25000' /> ";
	html+="<button onClick='searchStation()'>Search</button> ";

	html+="<select onChange='showWeatherData()' id='choose_stat'></select><table id='weather_data'></table>";

	jQuery('#test_api').html(html);

}



function testModel(){
	var options={
		//weather data variable
		'latitude': 43.35012,
		'longitude': 10.52148,
		'startTime': '2015-01-01T00:00:00',
		'endTime': '2015-02-28T00:00:00',
		'url_weather': '/smartIPM/api/weather-scenario-simple',
		'weatherVariable': ['0 0 0', '0 0 1'],
		
		//model variable
		'lowerThreshold':12,
		'upperThreshold':32, 
		'requiredDayDegree':100,
		'url_model': '/smartIPM/api/run-model',
		
		//output variable.
		'div_element':'test_model'
	}

	var form='<input name="latitude" id="latitude" value="'+options.latitude+'" />';
	form+='<input name="longitude" id="longitude" value="'+options.longitude+'" />';
	form+='<input name="startTime" id="startTime" value="'+options.startTime+'" />';
	form+='<input name="endTime" id="endTime" value="'+options.endTime+'" />';
	form+='<input name="url_weather" id="url_weather" value="'+options.url_weather+'" />';
	form+='<input name="weatherVariable" id="weatherVariable" value="'+(options.weatherVariable[0])+'" />';
	form+='<button onClick="testModelRun()">Update</button>';
	
	var formm = '<input name="lowerThreshold" id="lowerThreshold" value="'+options.lowerThreshold+'" />';
	formm += '<input name="upperThreshold" id="upperThreshold" value="'+options.upperThreshold+'" />';
	formm += '<input name="requiredDayDegree" id="requiredDayDegree" value="'+options.requiredDayDegree+'" />';
	formm +='<input name="url_model" id="url_model" value="'+options.url_model+'" />';
	
	jQuery('#form_test_weather').html(form);
	jQuery('#form_test_model').html(formm);
	//url='http://www.smartipm.eu/smartIPM/api/weather-scenario-simple';
	
	testModelRun();
}

function testModelRun(){

	var options={
		//weather data variable
		'latitude': jQuery('#latitude').val(),
		'longitude': jQuery('#longitude').val(),
		'startTime': jQuery('#startTime').val(),
		'endTime': jQuery('#endTime').val(),
		'url_weather': jQuery('#url_weather').val(),
		'weatherVariable': Array((jQuery('#weatherVariable').val())),
		
		//model variable
		'lowerThreshold': jQuery('#lowerThreshold').val(),
		'upperThreshold': jQuery('#upperThreshold').val(), 
		'requiredDayDegree': jQuery('#requiredDayDegree').val(),
		'url_model': jQuery('#url_model').val(),
		
		//output variable.
		'div_element':'#test_model'
	}

	runModel(options);

}


function testApi2(){

	var options={
		'latitude': 43.35012,
		'longitude': 10.52148,
		'startTime': '2015-01-01T00:00:00',
		'endTime': '2015-02-28T00:00:00',
		'url': '/smartIPM/api/weather-scenario-simple',
		'weatherVariable': ['0 0 0', '0 0 1']
	}

	var form='<input name="latitude" id="latitude" value="'+options.latitude+'" />';
	form+='<input name="longitude" id="longitude" value="'+options.longitude+'" />';
	form+='<input name="startTime" id="startTime" value="'+options.startTime+'" />';
	form+='<input name="endTime" id="endTime" value="'+options.endTime+'" />';
	form+='<input name="url" id="url" value="'+options.url+'" />';
	form+='<input name="weatherVariable" id="weatherVariable" value="'+(options.weatherVariable[0])+'" />';
	form+='<button onClick="testApi2Run()">Update</button>';

	jQuery('#form_test_api2').html(form);
	//url='http://www.smartipm.eu/smartIPM/api/weather-scenario-simple';

	
	testApi2Run();

}


function testApi2Run(){

		var options={
		'latitude': jQuery('#latitude').val(),
		'longitude': jQuery('#longitude').val(),
		'startTime': jQuery('#startTime').val(),
		'endTime': jQuery('#endTime').val(),
		'url': jQuery('#url').val(),
		'weatherVariable': Array((jQuery('#weatherVariable').val()))
	}

	runWSS(options);

}


