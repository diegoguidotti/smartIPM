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
		val = jQuery(xmldata).find('values').text();		
		aVal = CSV2array( val );		
		html = "Day degree: " + aVal[0][0];		
		console.log(aVal);
		jQuery('#'+div_element).html(html);
  });	

}


/////////////////////////////////////////////////////////////////////////////
// runWSS2
// ======================
// run a weather scanarion simple
/**
*/
function runWSS(options){

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
		console.log(xmldata);
		val = jQuery(xmldata).find('values').text();		
		aVal = CSV2array( val );		
		html = array2Table( aVal );		
		console.log(aVal);
		jQuery('#'+div_element).html(html);
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
// makeModel
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
		
		html += "<table>";
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
