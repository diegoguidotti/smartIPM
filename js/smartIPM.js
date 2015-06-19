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
		'div_element':'test_model'
	}

	runModel(options);

}

/////////////////////////////////////////////////////////////////////////////
// runModel
// ======================
// run a Model.
/**
*/
function runModel(options){

	url_model=options.url_model;
	url_weather=options.url_weather;

	console.log('Model on url '+url_model);	
	console.log('Weather on url '+url_weather);	

	xml = getXMLModel(options);
	console.log("runModel [xml]:" + xml);
	
	var div_element='test_model';
	console.log(options);
	if(options.div_element){
		div_element=options.div_element;
	}

	xmld = getModelData(url_model, xml);
  jQuery(document).ajaxStop(function () {
		console.log("xmldata");
		console.log(xmldata);
		modres = jQuery(xmldata).find('ModelResult');		

		console.log(modres);

		var val=jQuery(modres).find('day_degree').text();
		aVal = CSV2array( val );		
		html = "Cumulated Day degree: " + aVal[0][0]+'<h3>Events</h3>';		

		var ev=jQuery(modres).find('events');
		jQuery.each(ev, function(k,v){
			console.log(v);
			v=jQuery(v);
			html+='<li>'+v.find('label').text()+': '+v.find('value').text()+"</li>";
		});

		jQuery('#'+div_element).html(html);
  });	

}

function testModelManager(){
	var options = {
		'url': '/smartIPM/api/model-manager',
		'div_element':'test_model_manager'
	};
	runModelManager(options);
}

function runModelManager(options){
	
	var div_element='test_model_manager';
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
		jQuery('#'+div_element).html(html);
  });	
}

/////////////////////////////////////////////////////////////////////////////
// runWSS2
// ======================
// run a weather scanarion simple
/**
*/
function runWSS(options, exe_function){

	url=options.url;

	console.log('api2 on url '+url);	

	aWVar = Array('0 0 0');
	xml = getXMLWSS(options);
	console.log(xml);
	
	var div_element='test_api2';
	console.log(options);
	if(options.div_element){
		div_element=options.div_element;
	}

	xmld = getWeatherData(url, xml);


		jQuery(document).ajaxStop(function () {
			
			val = jQuery(xmldata).find('values').text();		
			aVal = CSV2array( val );		

			if(exe_function){
				exe_function(aVal);				
			}
			else{
				html = array2Table( aVal );		
				
				jQuery('#'+div_element).html(html);
			}
		});	

}


/////////////////////////////////////////////////////////////////////////////
// getXMLWSS
// ======================
// This function create a valid xml starting from imput parameters
/**
\param options a json containing all the needed data to generate the xml
\return xml 
*/
function getXMLWSS( options ){
	xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
	xml += '<ns3:WeatherScenarioSimpleRequestMessage xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag">'; 
	xml += '<latitude>'+options.latitude+'</latitude>';
	xml += '<longitude>'+options.longitude+'</longitude>';
	xml += '<startTime>'+options.startTime+'</startTime>';
	xml += '<endTime>'+options.endTime+'</endTime>';
	
	for( nV = 0; nV < options.weatherVariable.length; nV++ )
	{
		xml += '<weatherVariable>'+options.weatherVariable[nV]+'</weatherVariable>';
	}
	xml += '</ns3:WeatherScenarioSimpleRequestMessage>';
	
	return xml;
}

var xmldata;

/////////////////////////////////////////////////////////////////////////////
// getXMLModel
// ======================
// This function create a valid xml starting from imput parameters
/**
\param options a json containing all the needed data to generate the xml
\return xml 
*/
function getXMLModel( options ){
	xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
	xml += '<RunPestModelRequestMessage xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag" xmlns:nsipm="http://www.smartIPM.eu/schema">';
	xml += '<WeatherData>';
	xml += '<capabilities>';
	xml += '<id>31</id>';
	xml += '<description>smartipmslovenia</description>';	//<<<<<<<<<<<<<<<<<<<<<<< TODO:TO BE FIXED
	xml += '<uri>';
	xml += 'http://localhost/smartIPM/api/weather-scenario-simple';	//<<<<<<<<<<<<<<<<<<<<<<< TODO:TO BE FIXED
	xml += '</uri>';
	xml += '<cte_id>26</cte_id>';	//<<<<<<<<<<<<<<<<<<<<<<< TODO:TO BE FIXED
	xml += '<payload>';
	xml += '<WeatherScenarioSimpleRequestMessage xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag">'; 
	xml += '<latitude>'+options.latitude+'</latitude>';
	xml += '<longitude>'+options.longitude+'</longitude>';
	xml += '<startTime>'+options.startTime+'</startTime>';
	xml += '<endTime>'+options.endTime+'</endTime>';
	
	for( nV = 0; nV < options.weatherVariable.length; nV++ )
	{
		xml += '<weatherVariable>'+options.weatherVariable[nV]+'</weatherVariable>';
	}
	xml += '</WeatherScenarioSimpleRequestMessage>';
	xml += '</payload>';
	xml += '</capabilities>';
	xml += '</WeatherData>';
  xml += '<PestModel>';
  xml += '<lowerThreshold>'+options.lowerThreshold+'</lowerThreshold>';
  xml += '<upperThreshold>'+options.upperThreshold+'</upperThreshold>';
  xml += '<requiredDayDegree>'+options.requiredDayDegree+'</requiredDayDegree>';
  xml += '</PestModel>';
	xml += '</RunPestModelRequestMessage>';
	
	return xml;
}

/////////////////////////////////////////////////////////////////////////////
// getXMLModelManager
// ======================
// This function create a valid xml starting from imput parameters
/**
\param options a json containing all the needed data to generate the xml
\return xml 
*/
function getXMLModelManager( options ){
	xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
	xml += '<RunModelManagerRequest xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag" xmlns:nsipm="http://www.smartIPM.eu/schema">';
	
	
	
	xml += '</RunModelManagerRequest>';
	
	return xml;
}
var xmldata;

/////////////////////////////////////////////////////////////////////////////
// getWeatherData
// ======================
// This function get the weather daily data
/**
\param server  server
\param xml  valid xml generated from makeXML function
\return xml with the daily data
*/
function getWeatherData( url, xml ){
	jQuery.ajax({
    type: 'POST',
    url: url,
    contentType: 'application/xml',
    data: xml,
    dataType: 'xml',
    success: function(data){
				xmldata = data;
        console.log("device control succeeded");
				//console.log(data);
				return data;
    },
    error: function(e){
        console.log("Device control failed");
				console.log(e);
    },
    processData: false
  });
}

/////////////////////////////////////////////////////////////////////////////
// getModelData
// ======================
// This function get the weather daily data and calculate the Model
/**
\param server  server
\param xml  valid xml generated from makeXML function
\return xml with the daily data
*/
function getModelData( url, xml ){
	jQuery.ajax({
    type: 'POST',
    url: url,
    contentType: 'application/xml',
    data: xml,
    dataType: 'xml',
    success: function(data){
				xmldata = data;
        console.log("getModelData: device control succeeded");
				return data;
    },
    error: function(e){
        console.log("getModelData: Device control failed");
// 				console.log(url);
// 				console.log(xml);
				console.log(e);
    },
    processData: false
  });
}

/////////////////////////////////////////////////////////////////////////////
// getModelManagerData
// ======================
// This function get all the models
/**
\param server  server
\param xml  valid xml generated from makeXML function
\return xml with the daily data
*/
function getModelManagerData( url, xml ){
	jQuery.ajax({
    type: 'POST',
    url: url,
    contentType: 'application/xml',
    data: xml,
    dataType: 'xml',
    success: function(data){
				xmldata = data;
				//console.log(xmldata);
        console.log("getModelManagerData: device control succeeded");
				return data;
    },
    error: function(e){
        console.log("getModelManagerData: Device control failed");
// 				console.log(url);
// 				console.log(xml);
				console.log(e);
    },
    processData: false
  });
}

/////////////////////////////////////////////////////////////////////////////
// CSV2array
// ======================
// This function convert a csv to a multidimensional array
/**
\param csv  with ';' as separator and ':::' as row separator
\return aVal multidimensional array.
*/
function CSV2array( csv ) {
	aVal = csv.split(':::');
	
	for( n = 0; n < aVal.length; n++ )
		{
			aVal[n] = aVal[n].split(';');
		}
	
	return aVal
}

/////////////////////////////////////////////////////////////////////////////
// array2Table
// ======================
// This function convert the multidimensional array into html table.
/**
\param aVal multidimensional array.
\return html
*/
function array2Table( aVal ) {
	html = "";
	
	nRow = aVal.length;
	nCol = 0;
	if( nRow > 0 )
	{
		nCol = aVal[0].length;
		
		html += "<table border='1'>";
		html += "<tbody>";
		for( nR = 0; nR < nRow-1; nR++ )
			{
				html += "<tr>";
				for( nC = 0; nC < nCol; nC++ )
					{
						html += "<td>"+aVal[nR][nC]+"</td>";
					}
				html += "</tr>";
			}
		html += "</tbody>";
		html += "</table>";
	}
	
	return html;
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


var current_model=0;

var models=[
	{'id_model':0, 'model_name': 'Get Weather Data' }, 	
	{'id_model':1, 'model_name': 'Olive generation', 'lowerThreshold': 10, 'upperThreshold':40, 'requiredDayDegree':369}, 
	{'id_model':2, 'model_name': 'Olive summer mortality',  'lowerThreshold': 20, 'upperThreshold':45, 'requiredDayDegree':100} 
];



var marker;


function init_map(){
	jQuery( window ).resize(function() {
			smartIPM_resize();
		});
		smartIPM_resize();
				
		map = L.map('smartIPM_map', { zoomControl:false }).setView([43.6,10.6], 10);
		
		var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		subDomains = ['otile1','otile2','otile3','otile4'],
		mapquestAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.';
		var mapquest = new L.TileLayer(mapquestUrl, {maxZoom: 17, attribution: mapquestAttrib, subdomains: subDomains});
		map.addLayer(mapquest); 




		map.on('click', function(e){
			jQuery('#latitude').val(e.latlng.lat);
			jQuery('#longitude').val(e.latlng.lng);

			if(marker){
				map.removeLayer(marker);
			}
			marker = new L.marker(e.latlng).addTo(map);

			exeModelWebGIS();
		});

		updateListModels();
		createResult();

}

function exeModelWebGIS(){
	console.log('exeModelWebGIS'+current_model);
	var lat=jQuery('#latitude').val();
	var lon=jQuery('#latitude').val();



	if(current_model==0){

		var options={
			'latitude': jQuery('#latitude').val(),
			'longitude': jQuery('#longitude').val(),
			'startTime': jQuery('#startTime').val(),
			'endTime': jQuery('#endTime').val(),
			'url': '/smartIPM/api/weather-scenario-simple',
			'weatherVariable': Array('0 0 0'),
			'div_element': 'final_result' 
		}

		runWSS(options, function createChart(aVal){
				console.log('create_chart'+Math.random());
				

				jQuery.each(aVal, function(k,v){
					v[0]=v[0].substring(0,10);
				});
				
				
				

 				if( aVal.length > 1 )
					html = array2Table( aVal );
 				else
 					html = "No data available!";
				
				jQuery('#final_result').html(html);

				jQuery('#final_result table').addClass('table');

				
			});
	}
	else{
		
		var model_name=jQuery('#list_models li#model_'+current_model).text();

		var html='<h3>'+ model_name+'</h3>';
		html+='we need to run runModel..... ';

		var options={
			//weather data variable
			'latitude': jQuery('#latitude').val(),
			'longitude': jQuery('#longitude').val(),
			'startTime': jQuery('#startTime').val(),
			'endTime': jQuery('#endTime').val(),
			'url': '/smartIPM/api/weather-scenario-simple',
			'weatherVariable': Array('0 0 0'),		
			//model variable
			'lowerThreshold': jQuery('#lowerThreshold').val(),
			'upperThreshold': jQuery('#upperThreshold').val(), 
			'requiredDayDegree': jQuery('#requiredDayDegree').val(),
			'url_model': '/smartIPM/api/run-model',
			'div_element':'final_result'
		}

		runModel(options);



		jQuery('#final_result').html(html);
	}
}


function updateListModels(){
	var options = {
		'url': '/smartIPM/api/model-manager',
		'div_element':'test_model_manager'
	};
	runModelManager(options);
	
	var html='<h3>Available models</h3>';

	html+='<ul class="list-group">';

	first=true;

	jQuery.each(models, function(k,v){
			var cl='';
			if(first){
				cl='active';
				first=false;
			}

			html+="<li id='model_"+v.id_model+"' onClick='selectModel("+v.id_model+")' class='list-group-item "+cl+"'>"+v.model_name+"</li>";
	});
	html+='</ul>';



	jQuery('#list_models').html(html);
}

function createResult(){
	var html='';

	html+='<a class="btn btn-primary" data-toggle="collapse" href="#parameters" aria-expanded="false" aria-controls="parameters">Parameters</a>';
	html+="<div class='collapse' id='parameters'>";

		html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-lat">Lat</span><input id="latitude" type="text" class="form-control" placeholder="Latitude" aria-describedby="basic-addon-lat" value="43.70957890"></div>';
		html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-lon">Long</span><input id="longitude" type="text" class="form-control" placeholder="Longitude" aria-describedby="basic-addon-lon" value="10.557861328125"></div>';
html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-start">From</span><input id="startTime" type="text" class="form-control" placeholder="Start Time" aria-describedby="basic-addon-start" value="2014-07-01T00:00:00"></div>';
html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-end">To</span><input id="endTime" type="text" class="form-control" placeholder="End Time" aria-describedby="basic-addon-end" value="2014-12-31T00:00:00"></div>';

html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-low">Low</span><input id="lowerThreshold" type="text" class="form-control" placeholder="lowerThreshold" aria-describedby="basic-addon-low" value="10"></div>';
html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-up">Up</span><input id="upperThreshold" type="text" class="form-control" placeholder="upperThreshold" aria-describedby="basic-addon-uo" value="40"></div>';
html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-cum">DD</span><input id="requiredDayDegree" type="text" class="form-control" placeholder="requiredDayDegree" aria-describedby="basic-addon-cum" value="369"></div>';



	html+="</div>"
	html+='<h3>Results</h3><div id="final_result">';
	html+='<div class="alert alert-info" role="alert">Click on the Map to run the selected model</div>';
	html+='</div>';

	jQuery('#smartIPM_results').html(html);
	jQuery('#parameters .input-group-addon').width(40);

}


function selectModel(id_model){
	jQuery('#list_models li.list-group-item').removeClass('active');
	jQuery('#list_models li#model_'+id_model).addClass('active');
	current_model=id_model;


	jQuery('#lowerThreshold').val(models[current_model].lowerThreshold);
	jQuery('#upperThreshold').val(models[current_model].upperThreshold);
	jQuery('#requiredDayDegree').val(models[current_model].requiredDayDegree);

	

	exeModelWebGIS()
}

function smartIPM_resize(){
	var hh=jQuery(window).height();

	jQuery('#smartIPM_map').height(hh-100);
}
