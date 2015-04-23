

function testApi(){

	console.log('api');

	var html="<input name='lat' id='lat' value='43.664891' /> ";
	html+="<input name='lon' id='lon' value='10.632267' /> ";
	html+="<input name='distance' id='distance' value='25000' /> ";
	html+="<button onClick='searchStation()'>Search</button> ";

	html+="<select onChange='showWeatherData()' id='choose_stat'></select><table id='weather_data'></table>";

	jQuery('#test_api').html(html);

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
