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

/////////////////////////////////////////////////////////////////////////////
// testApi2
// ======================
// This function shows the weather data
/**
*/
function testApi2(){

	console.log('api2');
	
	/* -------- input variable -------- */
	lat = 43.35012;
	lon = 10.52148;
	
	data_from = '2015-01-01T00:00:00';
	data_to   = '2015-02-28T00:00:00';
	server    = 'localhost';
	//server    = '172.16.1.165';

	aWVar = Array('0 0 0');
	
	xml = makeXML(lat, lon, data_from, data_to, aWVar);
	

	xmld = getWeatherData(server, xml);
  jQuery(document).ajaxStop(function () {
		console.log("main");
		console.log(xmldata);
		val = jQuery(xmldata).find('values').text();
		
		aVal = CSV2array( val );
		
		html = array2Table( aVal );
		
		console.log(aVal);
		jQuery('#test_api2').html(html);
  });	

}

/////////////////////////////////////////////////////////////////////////////
// makeXML
// ======================
// This function create a valid xml starting from imput parameters
/**
\param lat  latitude
\param lon  longitude
\param data_from  start date
\param data_to  end date
\param aWVar   array with weather parameters
\return xml 
*/
function makeXML( lat, lon, data_from, data_to, aWVar ){
	xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
	xml += '<ns3:WeatherScenarioSimpleRequestMessage xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag">'; 
	xml += '<latitude>'+lat+'</latitude>';
	xml += '<longitude>'+lon+'</longitude>';
	xml += '<startTime>'+data_from+'</startTime>';
	xml += '<endTime>'+data_to+'</endTime>';
	
	for( nV = 0; nV < aWVar.length; nV++ )
	{
		xml += '<weatherVariable>'+aWVar[nV]+'</weatherVariable>';
	}
	xml += '</ns3:WeatherScenarioSimpleRequestMessage>';
	
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
function getWeatherData( server, xml ){
	jQuery.ajax({
    type: 'POST',
    url: 'http://'+server+'/smartIPM/api/weather-scenario-simple',
    contentType: 'application/xml',
    data: xml,
    dataType: 'xml',
    success: function(data){
				xmldata = data;
        console.log("device control succeeded");
				//console.log(data);
				return data;
    },
    error: function(){
        console.log("Device control failed");
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
