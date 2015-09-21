
window.addEventListener("DOMContentLoaded", init, false);

var mashup;

var latitude, longitude;

function init(){	

	latitude=	MashupPlatform.prefs.get("latitude");
	longitude=	MashupPlatform.prefs.get("longitude");

	username = MashupPlatform.context.get("username");  
	html='<div id="model_result">You need to select a point on the map</div><div style="display:none;" id="debug"></div>';	
	jQuery('#content').html(html);

	
		MashupPlatform.wiring.registerCallback("coordinates",function(val){

				debug("Run"+val);
				jQuery('#model_result').html('');

				if(val.indexOf('|')==-1){					
					coo=val.split(',');
					longitude=coo[0];
					latitude=coo[1];
				}
				else{
					coo=val.split('|');					
					latitude=coo[0];
					longitude=coo[1];
				}

				

				debug("latitude:"+latitude+" "+"longitude:"+longitude+" ");
				createWidget();
		});
		//testDashboard(username);
}


function debug(t){
	jQuery('#debug').append(t+"<br/>")
}

function createWidget(){

	var url=	MashupPlatform.prefs.get("url");
	var start_date=	MashupPlatform.prefs.get("start_date");
	var end_date=	MashupPlatform.prefs.get("end_date");
	var lowerThreshold=	MashupPlatform.prefs.get("lowerThreshold");
	var requiredDayDegree=	MashupPlatform.prefs.get("requiredDayDegree");

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

		debug(JSON.stringify(v));

		addModelWidget(v, '#model_result',0);  

}
