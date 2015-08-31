

var xxx;



var current_model=0;
var marker, marker_widget;

var models=[
	{'id_model':0, 'model_name': 'Get Weather Data', 'startModel': 't-10', 'endModel':'t' }, 	
	{'id_model':1, 'model_name': 'Olive generation', 'lowerThreshold': 10, 'startModel': 'j150', 'endModel':'t', 'upperThreshold':40, 'requiredDayDegree':369}, 
	{'id_model':2, 'model_name': 'OFF mortality', 'startModel': 't-20', 'endModel':'t', 'formula': '0.000002*exp(:tmed*0.2539)',custom_format:{'label': 'the estimated % of larvae mortality is '}} ,
	{'id_model':3, 'model_name': 'OFF fertility', 'startModel': 't-20', 'endModel':'t', 'lowerThreshold': 0,'formula': '-0.7439*pow(:tmed,2)+35.89*:tmed-407.63', 	custom_format:{'formatter': 'simple', 'label': 'Estimated number of eggs'} } ,
	{'id_model':4, 'model_name': 'Olive phenology', 'startModel': 'j1', 'endModel':'t', 'lowerThreshold': 10, 	
		custom_format:{
			'formatter': 'simple', 'label': 'Plant phenology stage', 
			'classes': [			
				{'limit': 225, 'label': 'Winter pause',  icon:'http://agroambiente.info.arsia.toscana.it/arsia/icone/arsia/pheno_olivo/bbch_0.png',     'class':'alert-info' },
				{'limit': 1100, 'label': 'Bud development', icon:'http://agroambiente.info.arsia.toscana.it/arsia/icone/arsia/pheno_olivo/bbch_33.png',       'class':'alert-success' },
        {'limit': 1410, 'label': 'Hard-Pit',  icon:'http://agroambiente.info.arsia.toscana.it/arsia/icone/arsia/pheno_olivo/bbch_75.png',     'class':'alert-warning' },
				{'limit': 1950, 'label': 'Olive growing',   icon:'http://agroambiente.info.arsia.toscana.it/arsia/icone/arsia/pheno_olivo/bbch_80.png',     'class':'alert-danger' },
				{'limit': 1950, 'label': 'Varaison',   icon:'http://agroambiente.info.arsia.toscana.it/arsia/icone/arsia/pheno_olivo/bbch_81.png',     'class':'alert-danger' },
				{'limit': 2500, 'label': 'Ripening',   icon:'http://agroambiente.info.arsia.toscana.it/arsia/icone/arsia/pheno_olivo/bbch_89.png',     'class':'alert-danger' },
				{'limit': 12500, 'label': 'Harvested',   icon:'http://agroambiente.info.arsia.toscana.it/arsia/icone/arsia/pheno_olivo/bbch_0.png',     'class':'alert-info' }
			]
		} 
	} ,
	{'id_model':5, 'model_name': 'Helicoverpa armigera', 'startModel': 'j1', 'endModel':'t', 'lowerThreshold': 10.71, 	
		custom_format:{
			'formatter': 'simple', 'label': 'The Heliotis stage', 
			'classes': [			
				{'limit': 180, 'label': 'Overwintering pupae', 'class':'alert-info' },
				{'limit': 222, 'label': 'Adults (pre-ovideposition)',   'class':'alert-warning' },
        {'limit': 295, 'label': 'Adults Ovideposition', 'class':'alert-warning' },
        {'limit': 335.5, 'label': 'Egg development', 'class':'alert-danger' },
				{'limit': 563, 'label': 'Larvae development', 'class':'alert-danger' },
				{'limit': 743, 'label': 'Pupae development', 'class':'alert-warning' },
				{'limit': 785.45, 'label': 'II gen adult', 'class':'alert-warning' }
				
			]
		} 
	}  ,
	{'id_model':6, 'model_name': 'Corn borer', 'startModel': 'j1', 'endModel':'t', 'lowerThreshold': 10, 	
		custom_format:{
			'formatter': 'simple', 'label': 'Corn borer I generation flight:', 
			'classes': [			
				{'limit': 230, 'label': 'Overwintering', 'class':'alert-info' },
				{'limit': 383, 'label': 'Beginning of adult Emergence',   'class':'alert-warning' },
        {'limit': 446, 'label': 'More then 50% of adult emergence', 'class':'alert-danger' },
        {'limit': 600, 'label': 'More then 70% adult emergence', 'class':'alert-danger' },
				{'limit': 601, 'label': 'End of I generation flight', 'class':'alert-info' }				
			]
		} 
	} 

];




/////////////////////////////////////////////////////////////////////////////
// runModel
// ======================
// run a Model.
/**
*/
function runModel(options){

	url_model=options.url_model;
	url_weather=options.url_weather;

	//console.log(options);

	//console.log('Model on url '+url_model);	
	//console.log('Weather on url '+url_weather);		
	xml = getXMLModel(options);
	jQuery('#xml_input').val(JSON.stringify(options));
	//console.log("runModel [xml]:" + xml);
	
	var div_element='#test_model';
	if(options.div_element){
		div_element=options.div_element;
	}

	jQuery.ajax({
		  type: 'POST',
		  url: url_model,
		  contentType: 'application/xml',
		  data: xml,
		  dataType: 'xml',
		  success: function(data){
					xmldata = data;
					
		      //console.log("getModelData: device control succeeded");

					modres = jQuery(xmldata).find('ModelResult');	

					var calc_perc=true;
					var lab_intro='The cumulated day degree has reached the';
					var classes={};

					if(options.custom_format){
						if(options.custom_format.formatter=='simple'){
							calc_perc=false;
						}
						if(options.custom_format.label){
							lab_intro=options.custom_format.label;
						}
						if(options.custom_format.classes){
							classes=options.custom_format.classes;
						}
					}

					

					//console.log(' XML: ');
					//console.log(modres);
					//console.log('JSON: ');
					//console.log(xml2Json(modres));

					var html='';
					
						var ooo=xml2Json(modres);
						console.log(options);	
						modres=ooo.ModelResult;
						
						var aVal = null;
						var description='';
						
						if(modres){
							//console.log(modres.results.values._text);
							aVal = CSV2array( modres.results.values._text );
							
							//console.log(aVal);
							var color="";
							var perc=parseFloat(aVal[aVal.length-2][2]); //aVal[0][1];
							var val="";


							if(classes.length>0){
								var found=false;



								jQuery.each(classes, function(k,v){																										
									if(!found){	
										color=v.class;
											
										val='<span class="smartipm_title">'+v.label+'</span>';
										if(v.icon){val+="<div class='smartipm_icon'><img  style='width:70px;' src='"+v.icon+"' /></div>";}		
										description=lab_intro+": "+v.label+" ("+(100*(v.limit-perc)/v.limit).toFixed(0)+"%)" ;	
									}

									if(v.limit>=perc){
										found=true;
									}
								})

								if(!found){
									var last=classes[classes.length-1];
									var lim=classes[classes.length-1].limit;									
									var data='';
									val='';

								for(n=0; n<aVal.length; n++){
									if(aVal[n][1]>lim){
										data=aVal[n][0].substring(0,10);																									
										break;
									}
								}

									val+="<div class='smartipm_date'>"+data+"</div>";
									description='The final stage of the model ('+last.label+') has been reached on '+data+'.';
								}
								

							}
							else{	
								var done=false;
								if(perc>=1){ //modres.events.length>0){
									color="alert-danger";
									if(modres.events.item0)	{
										if(modres.events.item0.value){
											if(modres.events.item0.value._text!=null){	
												var date=				modres.events.item0.value._text.substring(0,10);		
												val="<div class='smartipm_date'>"+date+"</div>";		
												description="The cumulated day degree has been reached the "+date+" (starting from "+genDateC(options.startModel)+" to "+genDateC(options.endModel)+").";								
												done=true;
											}
										}
									}	
								}


								if(!done){
									if(perc<0.5){
										color="alert-success";
									}
									else{
										color="alert-warning";
									}
								
	
								
									var lab=(perc*100).toFixed(0)+"%";
									if(!calc_perc){lab=(perc).toFixed(0);}

									val="<div class='smartipm_perc'>"+lab+"</div>";
									description=lab_intro+' '+lab+"";
									description+=" (from "+genDateC(options.startModel)+" to "+genDateC(options.endModel)+").";								
								}			
							}				
								
							html='<div class="row"><div class="'+color+' vcenter col-xs-12 dashboard_model_res"><div class="smartipm_value"><div class=" smartipm_to_center">'+val+'<div class="smartipm_description">'+description+'</div></div></div>';
							html+='</div>';



						}
						else{
								html+="n.d.";
						}	

						

					 jQuery(options.div_element).html('<div class="col-sm-12 sipm_tile"></div><div style="display:none;" class="col-sm-12 sipm_chart"></div><div style="display:none;" class="col-sm-12 sipm_table"></div><div class="sipm_change"><span class="glyphicon glyphicon-forward" aria-hidden="true"></div>');

					jQuery(options.div_element+" .sipm_tile").html(html);

					/*	
				     FIX the tile widtha nd height according with content
					*/
					var interior=				jQuery(options.div_element+' .smartipm_perc').width();
					var esterior=				jQuery(options.div_element+'').width();
					if(interior>esterior){
						
						var size=jQuery(options.div_element+' .smartipm_perc').css('font-size');
						size=parseInt(size.replace("px",""));
						console.log( size*(interior/esterior));
						jQuery(options.div_element+' .smartipm_perc').css('font-size', size*(esterior/interior)+'px');
					}

					jQuery(options.div_element+' .sipm_chart').width(esterior-10);	
					var esth=jQuery(options.div_element+'').height();	
				  var inth= jQuery(options.div_element+' .smartipm_to_center').height();	

					if(inth<esth){
						jQuery(options.div_element+' .smartipm_to_center').css('margin-top', ((esth-inth)/2).toFixed(0)+"px")
					}
					/*
					var desel=jQuery(options.div_element+' .smartipm_description');
					desel.css('position','absolute');
					desel.css('bottom',desel.height()+'px');
					*/

					if(aVal!=null){
						//console.log('SET CHAT TO '+options.div_element);			
						array2Chart( aVal , {'div_element':options.div_element+" .sipm_chart"});
						jQuery(options.div_element+" .sipm_table").html(array2Table( aVal, {
							"header": ["date", "value", "cumulated"],
							"formatter": function(r,c,val){

								var vvv;
								
								if(c==0){
									vvv=val.substring(0,10);
								}
								else{
									if(calc_perc){
											vvv=(parseFloat(val)*100).toFixed(0)+"%";
									}
									else{
											vvv=(parseFloat(val)).toFixed(0);
									}
								}
								return "<td>"+vvv+"</td>";
							}
						} ));

						jQuery(options.div_element+" .sipm_change").unbind().click(function(){
							if(jQuery(options.div_element+" .sipm_tile").css('display')=='block'){
								jQuery(options.div_element+" .sipm_tile").hide();
								jQuery(options.div_element+" .sipm_table").show();
							}
							else if(jQuery(options.div_element+" .sipm_table").css('display')=='block'){
								jQuery(options.div_element+" .sipm_table").hide();
								jQuery(options.div_element+" .sipm_chart").show();
							}
							else{
								jQuery(options.div_element+" .sipm_tile").show();
								jQuery(options.div_element+" .sipm_chart").hide();
							}

					
						});	
					}

					

					

					
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
// runWSS2
// ======================
// run a weather scanarion simple
/**
*/
function runWSS(options, exe_function){

	url=options.url;

	//console.log('api2 on url '+url);	

	aWVar = Array('0 0 0');
	jQuery('#xml_input').val(JSON.stringify(options));
	xml = getXMLWSS(options);
	
	var div_element='#test_api2';
	//console.log(options);
	if(options.div_element){
		div_element=options.div_element;
	}

	//xmld = getWeatherData(url, xml);

	jQuery.ajax({
		  type: 'POST',
		  url: url,
		  contentType: 'application/xml',
		  data: xml,
		  dataType: 'xml',
		  success: function(data){
					xmldata = data;
					val = jQuery(xmldata).find('values').text();		
					aVal = CSV2array( val );		

					if(exe_function){
						exe_function(aVal);				
					}
					else{
						html = array2Table( aVal );		
				
						jQuery(div_element).html(html);
					}


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
	xml += '<startTime>'+genDate(options.startModel)+'</startTime>';
	xml += '<endTime>'+genDate(options.endModel)+'</endTime>';
	
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
	xml += '<startTime>'+genDate(options.startModel)+'</startTime>';
	xml += '<endTime>'+genDate(options.endModel)+'</endTime>';
	
	for( nV = 0; nV < options.weatherVariable.length; nV++ )
	{
		xml += '<weatherVariable>'+options.weatherVariable[nV]+'</weatherVariable>';
	}
	xml += '</WeatherScenarioSimpleRequestMessage>';
	xml += '</payload>';
	xml += '</capabilities>';
	xml += '</WeatherData>';
  xml += '<PestModel>';
	xml += '<startModel>'+options.startModel+'</startModel>';
	xml += '<endModel>'+options.endModel+'</endModel>';
	if(options.formula){
	  xml += '<formula>'+options.formula+'</formula>';
	}
  xml += '<lowerThreshold>'+options.lowerThreshold+'</lowerThreshold>';
  xml += '<upperThreshold>'+options.upperThreshold+'</upperThreshold>';
  xml += '<requiredDayDegree>'+options.requiredDayDegree+'</requiredDayDegree>';
  xml += '</PestModel>';
	xml += '</RunPestModelRequestMessage>';
	
	return xml;
}

/////////////////////////////////////////////////////////////////////////////
// genDate
// ======================
// Transform the relative date text in actual date
//   t is today, t-10 is ten days before today
//   j1 is 1st of january j180 is 28th of june (29th in leap year)
/**
\mm the text
\year the year (default current year)
\return date 
*/


/* Transform the relative date text in actual date
   t is today, t-10 is ten days before today
   j1 is 1st of january j180 is 28th of june (29th in leap year)
*/
function genDateC(mm, year){

		mm.substring(0,1);
		if(typeof mm!='undefined'){
			var day = new Date();
			if(typeof year=='undefined'){
				year=day.getFullYear();
			}
			if(mm==''){mm='t';}
		
			if(mm.substring(0,1)=='t'){
				if(mm.length>1){
					var diff=parseInt(mm.substring(1,mm.length));
					var t=day.getTime()+(diff*24*3600000);
					day=new Date(t);
					//console.log((day+(diff*24*3600000)));

					//day= new Date(day+(diff*24*3600000)); //new Date(day+(diff*24*3600));
				}			
			}
			else if (mm.substring(0,1)=='j'){
				var jul=1
				if(mm.length>1){
					jul=parseInt(mm.substring(1,mm.length));
				}
				day=new Date(year+'-01-01');
				var t=day.getTime()+((jul-1)*24*3600000);
				day=new Date(t);
			}
			else{
				;
			}

			var dt=dateToString(day);
			return dt;
	}
	else{
		return '';
	}
}

function genDate(mm,yy){
	return genDateC(mm,yy)+"T00:00:00"
}

function dateToString(d){
	var dd = d.getDate();
	var mm = d.getMonth()+1; //January is 0!
	var yyyy = d.getFullYear();

	if(dd<10) {
		  dd='0'+dd
	} 

	if(mm<10) {
		  mm='0'+mm
	} 
	return yyyy+"-"+mm+"-"+dd;
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
var ooo;

function array2Table( aVal, options ) {
	html = "";
	if(typeof options == "undefined"){
		options={};
	}
	nRow = aVal.length;
	nCol = 0;
	if( nRow > 0 )
	{
		nCol = aVal[0].length;
		
		html += "<table border='1'>";

		if(options.header){
			html+="<thead><tr>";
			for( nH = 0; nH < options.header.length; nH++ ){
				html+="<th>"+options.header[nH]+"</th>";
			}
			html+="</tr><thead>";
		}

		html += "<tbody>";
		for( nR = 0; nR < nRow-1; nR++ )
			{
				html += "<tr>";
				for( nC = 0; nC < nCol; nC++ )
					{
						if(options.formatter){
							html+=options.formatter(nR, nC, aVal[nR][nC])
						}
						else{
							html += "<td>"+aVal[nR][nC]+"</td>";
						}
						/*
						if(nC==2){
							html += "<td>"+(100*parseFloat(aVal[nR][nC])).toFixed(0)+"%"+"</td>";
						}
						else{
							html += "<td>"+aVal[nR][nC]+"</td>";
						}
						*/
					}
				html += "</tr>";
			}
		html += "</tbody>";
		html += "</table>";
	}
	
	return html;
}



function array2Chart(aVal, opt){               
    var data=aVal;
    var dt2 = new Array();
    var dtc = new Array();
     jQuery.each(data , function(ii, dat) {
        if(dat){
            var d= parseDateSQL(dat[0]).getTime();
            dtc.push([d, dat[1]]);
        }
    });
		//console.log("CHART");
		//console.log(dtc);
    dt2.push({data: dtc, label:'average_data'});
    
    if(data){
				jQuery(opt.div_element).html('');
        var plot=jQuery.plot(opt.div_element,  dt2 , getSmartIPMChartOption());
    }        
    
}


function getSmartIPMChartOption(){
    return {
        series: {
                lines: {
                        show: true
                }
                ,
                points: {
                        show: true
                }
        },
        xaxis: {
                mode: "time"
        },
        selection: {
            mode: "x"
        },
        legend: {
            show: false
        },
        grid: {
                hoverable: true,
                clickable: true
        }
    };
}







function init_map(){

		init_all();
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
		populateEditWidget(models[0]);

}

function exeModelWebGIS(){
	

	var tit='';

	if(jQuery('#latitude').val()=='' || jQuery('#longitude').val()==''){

	}
	else{

		var options={};

		if(current_model==0){
				options={
					'url': '/smartIPM/api/weather-scenario-simple',
					'weatherVariable': Array('0 0 0'),
					'div_element': '#final_result' 
				}
				tit='Weather data';
			}
			else{
				tit=jQuery('#list_models li#model_'+current_model).text();

				options={
					'url': '/smartIPM/api/weather-scenario-simple',
					'weatherVariable': Array('0 0 0'),		
					'url_model': '/smartIPM/api/run-model',
					'div_element':'#final_result'
				}
			}

		options=generateOptions(options, current_model);
	

		v={"id_dashboard":0, "dashboard_title": tit, "dashboard_input": options };
	
		jQuery('#final_result').html('');
		addModelWidget(v, '#final_result', 0);

		jQuery('#save_dashboard').show();
	}
	
}

 
function parseDate(input) {
    var parts = input.split('-');
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[2], parts[1]-1, parts[0]); // months are 0-based
}

function parseDateSQL(input) {
		input=input.substring(0,10);
    var parts = input.split('-');
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
		
    return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
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

	html+='<h3>Results</h3><div id="final_result">';
	html+='<div class="alert alert-info" role="alert">Click on the Map to run the selected model</div>';
	html+='</div>';

	html+='<div id="save_dashboard_modal" class="modal fade">  <div class="modal-dialog">    <div class="modal-content">      <div class="modal-header">        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>        <h4 class="modal-title">Save to dashboard</h4>      </div>      <div class="modal-body">';

	html+='<form class="contact" name="contact">';
		html+='<div class="form-group"><label for="title">Title</label><br><input type="text" id="save_dashboard_title" name="title" class="form-control"></div>';
  html+='</form>';

	html+='</div>      <div class="modal-footer">        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>        <button type="button" class="btn btn-primary" id="save_dashboard_modal_save">Save changes</button>      </div>    </div><!-- /.modal-content -->  </div><!-- /.modal-dialog --></div><!-- /.modal -->';

	getEditWidgetModal();


	jQuery('#smartIPM_results').html(html);
	jQuery('#parameters .input-group-addon').width(40);

}




function selectModel(id_model){
	jQuery('#list_models li.list-group-item').removeClass('active');
	jQuery('#list_models li#model_'+id_model).addClass('active');
	
	console.log("SELECT MODEL");
	console.log(models);
	console.log(id_model);
	var model=null;
	current_model=id_model;

	jQuery.each(models,function(k,v){
		if(v.id_model==id_model)	{
			model=v;
			
		}	
	});
	console.log(model);

	if(model!=null){
		populateEditWidget(model);

		exeModelWebGIS()
	}
	else{
		alert('Model not found');
	}
}

function smartIPM_resize(){

	var hh=jQuery(window).height();
	jQuery('#smartIPM_map').height(hh-100);

	jQuery('body').css('padding-top',jQuery('.navbar-fixed-top').height()+'px');
}



//generate the "edit widget form"
function getEditWidgetModal(){

	var html='<div id="edit_widget_modal" class="modal fade">  <div class="modal-dialog">    <div class="modal-content">      <div class="modal-header">        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>        <h4 class="modal-title">Widget Parameter</h4>      </div>      <div class="modal-body">';

	html+='<form class="contact" name="contact">';
		html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-title">Title</span><input id="dashboard_title" type="text" class="form-control" placeholder="Widget Title" aria-describedby="basic-addon-title" value=""></input></div>';

		html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-title">Location</span><div id="map_widget"></div></div>';
/*
		html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-lat">Lat</span><input id="latitude" type="text" class="form-control" placeholder="Latitude" aria-describedby="basic-addon-lat" value=""></input></div>';
		html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-lon">Long</span><input id="longitude" type="text" class="form-control" placeholder="Longitude" aria-describedby="basic-addon-lon" value=""></input></div>';
*/
html+='<input id="latitude" type="hidden" value=""><input id="longitude" type="hidden" value="">';

html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-start">From</span><input id="startModel" type="text" class="form-control" placeholder="Start Model" aria-describedby="basic-addon-start" value="j1"></input><select id="startModelSel" class="form-control"><option value="j">Day of the year</option><option  value="t">Day from today</option></select><input id="startModelNum" type="number" class="form-control" placeholder="Start Model" value=""></input><div id="startModelEx"></div></div>';

html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-end">To</span><input id="endModel" type="text" class="form-control" placeholder="End Model" aria-describedby="basic-addon-end" value="t"></input><select id="endModelSel" class="form-control"><option value="j">Day of the year</option><option  value="t">Day from today</option></select><input id="endModelNum" type="number" class="form-control" placeholder="End Model" value=""></input><div id="endModelEx"></div></div>';

//		html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-end">To</span><input id="endModel" type="text" class="form-control" placeholder="End Model" aria-describedby="basic-addon-end" value="t"></input></div>';

		html+='<a class="btn btn-primary" id="advanced_params_button" data-toggle="collapse" href="#advanced_params" aria-expanded="false" aria-controls="parameters">Advanced Parameters</a>'
		html+="<div class='collapse' id='advanced_params'>";
			html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-low">Low</span><input id="lowerThreshold" type="text" class="form-control" placeholder="lowerThreshold" aria-describedby="basic-addon-low" value="10"></input></div>';
			html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-up">Up</span><input id="upperThreshold" type="text" class="form-control" placeholder="upperThreshold" aria-describedby="basic-addon-uo" value="40"></div>';
			html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-cum">DD</span><input id="requiredDayDegree" type="text" class="form-control" placeholder="requiredDayDegree" aria-describedby="basic-addon-cum" value="369"></input></div>';
		html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-formula">Formula</span><input id="formula" type="text" class="form-control" placeholder="Math Formula" aria-describedby="basic-addon-formula" value=""></input></div>';
		html+='<div class="input-group"><span class="input-group-addon" id="basic-addon-custom">Format</span><textarea id="custom_format" type="text" class="form-control" placeholder="Custom params" aria-describedby="basic-addon-custom" value=""></textarea></div>';


	html+='<textarea style="display:none" id="xml_input" type="text" class="form-control" placeholder="xml input" aria-describedby="basic-addon-xml" value=""></textarea>';
		html+="</div>";


	html+='</div>      <div class="modal-footer">        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>        <button type="button" class="btn btn-primary" id="edit_widget_modal_save">Save changes</button>      </div>    </div><!-- /.modal-content -->  </div><!-- /.modal-dialog --></div><!-- /.modal -->';


	jQuery('body').append(html);

	
	fixDateSelector('startModel');
	fixDateSelector('endModel');

	map_widget = L.map('map_widget', { zoomControl:false }).setView([43.6,10.6], 10);
		
	var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
	subDomains = ['otile1','otile2','otile3','otile4'],
	mapquestAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors.';
	var mapquest = new L.TileLayer(mapquestUrl, {maxZoom: 17, attribution: mapquestAttrib, subdomains: subDomains});
	map_widget.addLayer(mapquest); 

	map_widget.on('click', function(e){
		jQuery('#latitude').val(e.latlng.lat);
		jQuery('#longitude').val(e.latlng.lng);
		if(marker_widget){
			map_widget.removeLayer(marker_widget);
		}
		marker_widget = new L.marker(e.latlng).addTo(map_widget);		
	});



	

}

function fixDateSelector(el){

	console.log(el);

	jQuery('#'+el+'Sel').on('change', function(){	
		changeDateSelector(el);		
	});	
	jQuery('#'+el+'Num').on('change', function(){	
		changeDateSelector(el);		
	});	

	jQuery('#'+el+'').on('change', function(){	
		var dt=jQuery('#'+el+'').val();
		var sel=dt.substring(0,1);
		var num=dt.substring(1,dt.length);
		jQuery('#'+el+'Sel').val(sel);
		jQuery('#'+el+'Num').val(num);

		jQuery('#'+el+'Ex').html(genDateC(dt));
		
	});	
}

function changeDateSelector(el){
	var dt=jQuery('#'+el+'Sel').val()+jQuery('#'+el+'Num').val();
	jQuery('#'+el).val(dt );
	jQuery('#'+el+'Ex').html(genDateC(dt));
}
	


/* Populate the "edit widget form" with options data
*/
function populateEditWidget(options){

	console.log("POPULATE");
	
		if(options){
		if(options.dashboard_title){
			jQuery('#dashboard_title').val(options.dashboard_title);
		}
		if(options.latitude){
			jQuery('#latitude').val(options.latitude);
		}
		if(options.longitude){
			jQuery('#longitude').val(options.longitude);
		}

		jQuery('#startModel').val(options.startModel);
		jQuery('#startModel').trigger("change");
		jQuery('#endModel').val(options.endModel);
		jQuery('#endModel').trigger("change");

		jQuery('#lowerThreshold').val(options.lowerThreshold);
		jQuery('#upperThreshold').val(options.upperThreshold);
		jQuery('#requiredDayDegree').val(options.requiredDayDegree);
		if(options.custom_format){
			jQuery('#formula').val(options.formula);
		}
		else{
			jQuery('#formula').val('');
		}
		if(options.custom_format){
			jQuery('#custom_format').val(JSON.stringify(options.custom_format));
		}
		else{
			jQuery('#custom_format').val('');
		}
		

	}
	else{
		alert('There are an error in model');
	}
	
}


function populateEditWidgetPost(){


		
		var lat=jQuery('#latitude').val();
		var lon=jQuery('#longitude').val();


		if(marker_widget){
			map_widget.removeLayer(marker_widget);
		}


		marker_widget = new L.marker([lat, lon]).addTo(map_widget);	
		map_widget.setView([lat, lon],12);	
		
		
}

/* Add to model option array the value from the edit widget form
*/
function generateOptions(options){

	if(jQuery('#dashboard_title').val()!=''){
		options.dashboard_title=jQuery('#dashboard_title').val();
	}
	if(jQuery('#latitude').val()!=''){
		options.latitude=jQuery('#latitude').val();
	}
	if(jQuery('#longitude').val()!=''){
		options.longitude=jQuery('#longitude').val();
	}
	if(jQuery('#startModel').val()!=''){
		options.startModel=jQuery('#startModel').val();
	}
	if(jQuery('#endModel').val()!=''){
		options.endModel=jQuery('#endModel').val();
	}
	if(jQuery('#lowerThreshold').val()!=''){
		options.lowerThreshold=jQuery('#lowerThreshold').val();
	}
	if(jQuery('#upperThreshold').val()!=''){
		options.upperThreshold=jQuery('#upperThreshold').val();
	}
	if(jQuery('#requiredDayDegree').val()!=''){
		options.requiredDayDegree=jQuery('#requiredDayDegree').val();
	}
	if(jQuery('#formula').val()!=''){
		options.formula=jQuery('#formula').val();
	}
	if(jQuery('#custom_format').val()!=''){
		options.custom_format=JSON.parse(jQuery('#custom_format').val());
	}



	console.log(options);
	return options;
}


function editWidget(k, v, pos){

	console.log("edit widget "+k+" "+pos);
	console.log(v);

	if(k>0){
		var options=JSON.parse(v.dashboard_input);
		populateEditWidget(options);
	}

	populateEditWidgetPost();
	jQuery('#edit_widget_modal').modal('show');//.trigger('shown.bs.modal');



	jQuery('#edit_widget_modal').on('shown.bs.modal', function(){
			map_widget.invalidateSize();
	});


	jQuery('#edit_widget_modal_save').unbind().click(function(){

		if(k==0){
			exeModelWebGIS();
			jQuery('#edit_widget_modal').modal('hide');		

		}
		else{
			options.div_element='#dashboard_'+k;
			options=generateOptions(options);
			v.dashboard_input=JSON.stringify(options);
			

			jQuery.ajax({
				type: 'POST',
				url: '/smartIPM/api/dashboard/update/'+k,
				data: v.dashboard_input,
				dataType: 'json',
				success: function(data){
					
					populateWidget(options);
					//needs to unbind the edit function adding the new options data in v			
					jQuery('#edit_dashboard_'+k).unbind().click(function(){
						editWidget(k,v,pos);
					});

					//console.log('#edit_dashboard_'+k+' h4');
					//console.log(options.dashboard_title);
					jQuery('#dashboard_el_'+k+' h4').html(options.dashboard_title);
					jQuery('#edit_widget_modal').modal('hide');		

					
				},
				error: function(e){
					  console.log("Device control failed");
						console.log(e);
						alert('An error occurred during saving the dashboard');
				},
				processData: false
			});


		}

	});
}

function saveWidgetToDashboard(k, v){

	jQuery('#save_dashboard_title').val(v.dashboard_title);
	jQuery('#save_dashboard_modal').modal('show');


	jQuery('#save_dashboard_modal_save').unbind().click(function(){

		//var options=(jQuery('#xml_input').val());
		//var o=JSON.parse(options);
		var o=v.dashboard_input
		o.dashboard_title=	jQuery('#save_dashboard_title').val();;


		options=JSON.stringify(v.dashboard_input);

		//console.log(options);

		jQuery.ajax({
		  type: 'POST',
		  url: '/smartIPM/api/dashboard/add',
			data: options,
		  dataType: 'json',
		  success: function(data){

					jQuery('#final_result').html("The result has been saved. <a class='btn btn-lg' href='?sect=dashboard'>Visit the dashboard</a>");
					jQuery('#save_dashboard_modal').modal('hide');

					
		  },
		  error: function(e){
		      console.log("Device control failed");
					console.log(e);
					alert('An error occurred during saving the dashboard');
		  },
		  processData: false
		});
	});

}

function deleteFromDashboard(id_dashboard){

	jQuery.ajax({
    type: 'GET',
    url: '/smartIPM/api/dashboard/delete/'+id_dashboard,
    dataType: 'json',
    success: function(data){
				console.log('OK');
				console.log(data);
				
				jQuery(jQuery('#dashboard_el_'+id_dashboard)).remove()				
				if(jQuery('.dashboard_tile').length==0){
					setEmptyDashboard();
				}
    },
    error: function(e){
        console.log("Device control failed");
				console.log(e);
    },
    processData: false
  });

}


function init_all(){
		jQuery( window ).resize(function() {
			smartIPM_resize();
		});
		smartIPM_resize();
}

function init_home(){
	init_all();
}


function init_dashboard(){

	init_all();
	var html='';

	getEditWidgetModal();

	//drag the tiles
	jQuery('#dashboard_container').sortable({handle: 'h4',
		'revert':true,
		stop: function( event, ui ) {			
			console.log(event);
			//console.log(ui.item[0].attr('id'));
			var moved_id=jQuery(ui.item).attr('id')
			var final_pos=0;
			jQuery.each(jQuery('#dashboard_container .dashboard_tile'), function (k,v){				
				if(jQuery(v).attr('id')==moved_id){					
					final_pos=k+1;
				}
			});

			var id_dashboard=moved_id.substring(13, moved_id.length);

			console.log(final_pos);

			jQuery.ajax({
				type: 'GET',
				url: '/smartIPM/api/dashboard/move/'+id_dashboard+"/"+final_pos,
				dataType: 'json',
				success: function(data){
						console.log('OK Move');
				},
				error: function(e){
				    console.log("Device control failed Move");
						console.log(e);
				}		  
			});
			
		}
	});
	jQuery('#dashboard_container').disableSelection();

	jQuery.ajax({
    type: 'POST',
    url: '/smartIPM/api/dashboard',	
    dataType: 'json',
    success: function(data){
				console.log('OK');
				//console.log(data);
				//console.log(data.data.length);

				if(data.data.length==0){
					setEmptyDashboard();
				}
				else{
					jQuery.each(data.data, function (k,v){
						addModelWidget(v, '#dashboard_container', k);
					})
				}

				
    },
    error: function(e){
        console.log("Device control failed");
				console.log(e);
    },
    processData: false
  });

}


function setEmptyDashboard(){
	var html='<div class="jumbotron"><div class="container"><h1>Empty dashboard</h1>To add a model widget on your dashboard visit the Model page, click on the map and choose a model, and then save on the dashboard the results.</p><p><a class="btn btn-primary btn-lg" href="?sect=run_model" role="button">Run a model »</a></p></div></div>';
	jQuery('#dashboard_container').html(html);
}


function addModelWidget(v, div_element, pos){

				if(!pos){pos=0;}

				var num=pos;
				var tit='';					
				if(v.dashboard_title)	{
					tit=v.dashboard_title;
				}

				var k=v.id_dashboard;
				
				var cls="panel panel-default ";
				if(k>0){
					cls+="col-lg-3 col-md-4 col-sm-6 col-xs-12";
				}

				var html='<div class="dashboard_tile panel panel-default '+cls+'"  id="dashboard_el_'+k+'" >';
					html+='<div class="panel-heading clearfix"><h4 data-toggle="tooltip" title="'+tit+'" class="panel-title pull-left" style="padding-top: 7.5px;">'+tit+'</h4> ';
						html+='<div class="btn-group pull-right">';
							if(k>0){
								html+='<a onClick=deleteFromDashboard('+k+') class="btn btn-default btn-sm"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>';
							}
							else{
								html+='<a id="save_to_dashboard_'+k+'" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-star" aria-hidden="true"></span></a>';
							}
								html+='<a id="edit_dashboard_'+k+'"  class="btn btn-default btn-sm"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
						html+='</div>';
	  			html+='</div>';
					html+='<div class="panel-body" id="dashboard_'+k+'" ><img src="resources/waiting.gif"/></div>';
					html+='</div>';
				
				jQuery(div_element).append(html);

				jQuery('#edit_dashboard_'+k).unbind().click(function(){
					editWidget(k,v,pos);
				});


				jQuery('#save_to_dashboard_'+k).unbind().click(function(){
					saveWidgetToDashboard(k,v);
				});

				var h=jQuery('#dashboard_el_'+k).width();				

				//jQuery('#dashboard_el_'+k).height(h);
				//jQuery('#dashboard_'+k).height(h-80);
				jQuery('#dashboard_el_'+k).height(263);
				jQuery('#dashboard_'+k).height(263-80);

				jQuery('#dashboard_el_'+k+" h4").width(h-100);

				var options=v.dashboard_input;
				console.log(typeof options);
				if(typeof options != 'object'){
					options=JSON.parse(options);
				}
				
				options.div_element='#dashboard_'+k;

				

				setTimeout(function(){
					populateWidget(options);
				},100*num);
}

function populateWidget(options){

	var url_model=options.url_model;

	if(typeof url_model=='undefined'){
		runWSS(options, function createChart(aVal){
			jQuery.each(aVal, function(k,v){
				v[0]=v[0].substring(0,10);
			});
			if( aVal.length > 1 ){	
				jQuery(options.div_element).html('<div class="sipm_chart"></div><div style="display:none;" class="col-sm-12 sipm_table"></div><div class="sipm_change"><span class="glyphicon glyphicon-forward" aria-hidden="true"></div>');

				//console.log('SET CHAT TO '+options.div_element);			
				array2Chart( aVal , {'div_element':options.div_element+" .sipm_chart"});
				jQuery(options.div_element+" .sipm_table").html(array2Table( aVal, {"header":["date", "temp"]} ));

				//console.log("options.div_element+" .change_button);
				jQuery(options.div_element+" .sipm_change").unbind().click(function(){
					jQuery(options.div_element+" .sipm_table").toggle();
					jQuery(options.div_element+" .sipm_chart").toggle();
					
				});
			}
			else{
				html = "No data available!";				
				jQuery(options.div_element).html(html);
			}

		});
	}
	else{
		runModel(options);
	}
}

function xmlToString(xmlData) 
{
    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
} 

// Changes XML to JSON
function xml2Json(xmlObj) {
	
	var xmls=xmlToString(xmlObj[0]);
	//console.log("STRING |"+xmls+"|");
	var obj= xmlToJSON.parseString(xmls, {normalize: true, xmlns: false, childrenAsArray: false});
	return obj;	
};

