<?php

/**
 * 
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace smartIPM;
use Respect\Rest\Router;
 
class APIManager {

	private $db;
	private $aSetting;

		
    public function __construct($db, $aSetting)
    {
			$this->db=$db;
			$this->aSetting=$aSetting;
    }


		public function exeRest(){

			$r3 = new Router('/smartIPM');

			$db=$this->db;


			$r3->any('/api/weather/', function() use ($db) {
				$body = file_get_contents("php://input");

				$filter=json_decode($body);

				$q="select * from weather_station WHERE 1=1 ";
				$aVar=Array();

				$ok=true;
				$msg="";
				if(isset($filter)){
					if(isset($filter->simpleRequestMessage)){
						$q.=" AND ST_Distance_Spheroid(geom, st_geomFromText('POINT( '||:lon||' '||:lat||')',4326),'SPHEROID[\"WGS 84\",6378137,298.257223563]')<:dist  ";
						//$q.=' AND station_name=:laat';
						$aVar = Array(":lon" => $filter->simpleRequestMessage->longitude, ":lat" => $filter->simpleRequestMessage->latitude, ":dist" => $filter->simpleRequestMessage->distance);


//						$q.=" AND distance(geom, st_geomFromText('POINT(".$filter->simpleRequestMessage->longitude." ".$filter->simpleRequestMessage->latitude.")',4326))<".$filter->simpleRequestMessage->buffer."  ";
					}
				}
				else{
					
					if($body!=""){
						$ok=false; $msg="Unvalid body content";
					}
				}

			
				$res = $db->select($q, $aVar);
				 
				if($ok){
					return '{ "ok": true, "weather_stations": '.json_encode($res['data']).'}';
				}
				else{
					return '{ "ok": false,  "msg": "'.$msg.'"}';

				}
			});

			$r3->any('/api/weather/*', function($id_weather_station) use ($db) {

				//fisrt check if weather station exists
				$res = $db->select("select * from weather_station WHERE id_weather_station=:id_weather_station", Array(':id_weather_station'=>$id_weather_station));

				if(count($res['data'])>0){
					$resd = $db->select("select time_ref, tmin, tmax, tavg from weather_data WHERE id_weather_station=:id_weather_station", Array(':id_weather_station'=>$id_weather_station));
					return '{ "weather_data": '.json_encode($resd['data'])."}";
				}
				else{
					return '{"ok": false, "msg": "Station not found"}';
				}
			});

			$r3->any('/api/model/', function() use ($db) {
		
				$res = $db->select("select * from model", Array());
				return "{ 'models': ".json_encode($res['data']).'}';
			});

			$r3->any('/api/model/*', function($id_model) use ($db) {

				//fisrt check if weather station exists
				$res = $db->select("select * from model WHERE id_model=:id_model", Array(':id_model'=>$id_model));

				if(count($res['data'])>0){

					$ress = $db->select("select * from model_stage WHERE id_model=:id_model", Array(':id_model'=>$id_model));

					return '{ "model": '.json_encode($res['data'][0]).', "stages": '.json_encode($ress['data']).'}';
				}
				else{
					return '{"ok": false, "msg": "Model not found"}';
				}
			});

			$r3->any('/api/run/*/*', function($id_model, $id_weather_station) use ($db) {

				//fisrt check if weather station exists
				$res = $db->select("select * from model WHERE id_model=:id_model", Array(':id_model'=>$id_model));

				if(count($res['data'])>0){

					$ress = $db->select("select * from model_stage WHERE id_model=:id_model", Array(':id_model'=>$id_model));

					$model = '{ "model": '.json_encode($res['data'][0]).', "stages": '.json_encode($ress['data']).'}';
					$res2 = $db->select("select * from weather_station WHERE id_weather_station=:id_weather_station", Array(':id_weather_station'=>$id_weather_station));

				if(count($res2['data'])>0){
					$resd = $db->select("select time_ref, tmin, tmax, tavg from weather_data WHERE id_weather_station=:id_weather_station", Array(':id_weather_station'=>$id_weather_station));
					$weather= '{ "weather_data": '.json_encode($resd['data'])."}";

					return	run_model(json_decode($model), json_decode($weather));
					
				}
				else{
					return '{"ok": false, "msg": "Station not found"}';
				}
					

				}
				else{
					return '{"ok": false, "msg": "Model not found"}';
				}
			});

			$api=$this;

			$r3->any('/api/weather-scenario-simple/', function() use ($db, $api) {
				
				$body = file_get_contents("php://input");

				$weatherProvider=new WeatherProvider($db, Array());

				return $weatherProvider->exeApi($body);

			});
			
			$r3->any('/api/run-model/', function() use ( $db ) {

				$body = file_get_contents("php://input");				

				$runModel=new RunModel($db, Array());

				return $runModel->exeApi($body);
				
			});
						
			$r3->any('/api/model-manager/', function() use ( $db ) {

				$body = file_get_contents("php://input");

				$runModelManager=new ModelManager($db, Array());

				return $runModelManager->exeApi($body);
				
			});
						
			$r3->any('/**', function ($url) {
					return '{"ok": false, "msg": "Unvalid request", "url": '.json_encode($url).'}';
			});
		}
	


	
}

	

function run_model($model, $weather){

	$ok=true;
	$msg="";

	if(isset($weather->weather_data)){
		if(count($weather->weather_data)>0){
			$msg="there are ".count($weather->weather_data)." records";
			
		}
		else{
			$ok=false;
			$msg="There are no weather data";
		}
	}
	else{
		$ok=false;
		$msg="There are no weather valid object";
	}
	return '{"ok": '.$ok.', "msg": "'.$msg.'", "weather": '.json_encode($weather).',"model_result": [{"firsat generation": "2014-08-01"}]}';
	
}

?>
