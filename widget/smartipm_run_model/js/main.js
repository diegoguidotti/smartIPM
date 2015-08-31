
window.addEventListener("DOMContentLoaded", init, false);

var mashup;

var latitude, longitude;

function init(){	

// 
	var url=	MashupPlatform.prefs.get("url");
	latitude=	MashupPlatform.prefs.get("latitude");
	longitude=	MashupPlatform.prefs.get("longitude");
	var start_date=	MashupPlatform.prefs.get("start_date");
	var end_date=	MashupPlatform.prefs.get("end_date");
	var lowerThreshold=	MashupPlatform.prefs.get("lowerThreshold");
	var requiredDayDegree=	MashupPlatform.prefs.get("requiredDayDegree");

	username = MashupPlatform.context.get("username");  
	html='<div id="model_result">You need to select a point on the map</div>';	
	jQuery('#content').html(html);

	
		MashupPlatform.wiring.registerCallback("coordinates",function(val){

				console.log(val);
				coo=val.split(val,"|");
				jQuery('#model_result').html('');
				latitude=coo[0];
				longitude=coo[1];
				createWidget();
		});
		//testDashboard(username);
}


function createWidget(){

	var options={};
	current_model=1;
	if(current_model==0){
			options={
				'url': url+'weather-scenario-simple',
				'weatherVariable': Array('0 0 0'),
				'div_element': '#final_result' 
			}
		}
		else{
			options={
				'url': url+'weather-scenario-simple',
				'weatherVariable': Array('0 0 0'),		
				'url_model': url+'run-model',
				'div_element':'#final_result'
			}
		}

		options.dashboard_title='';
		options.latitude=latitude;
		options.longitude=longitude;
		options.startModel=start_date;
		options.endModel=end_date;
		options.lowerThreshold=lowerThreshold;
		options.requiredDayDegree=requiredDayDegree;

		v={"id_dashboard":0, "dashboard_title": '', "dashboard_input": options };

		console.log(v)

		addModelWidget(v, '#model_result',0);  

}
