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

			$r3->any('/api/weather-scenario-simple/', function() use ($db) {
				
				$body = file_get_contents("php://input");
				
				$obj = simplexml_load_string($body);
				
				$startTime    = $obj->startTime;
				$endTime      = $obj->endTime;
				$toSeparator  = ";";
				$blSeparator  = ":::";
				$decSeparator = ".";
				
				//print_r($obj);
				$res_data = $this->getWeatherData($obj);
				
				if( $res_data['ok'] )
					{
						$outcsv = "";
						
						$aWField = $this->getWeatherParameter($obj);
						$aWCode  = $this->getWeatherParameter($obj,false);

						for( $r = 0; $r < $res_data['rowCount']; $r++ )
							{
								$outcsv .= $res_data['data'][$r]['time_ref'] . $toSeparator;
								
								for( $nF = 0; $nF < count($aWField); $nF++ )
									{
										if( $nF < count($aWField) -1 )
											$outcsv .= $res_data['data'][$r][$aWField[$nF]] . $toSeparator;
										else
											$outcsv .= $res_data['data'][$r][$aWField[$nF]] . $blSeparator;
										
									}
// 								$outcsv .= $res_data['data'][$r]['tmin'] . $toSeparator;
// 								$outcsv .= $res_data['data'][$r]['tmax'] . $blSeparator; 
							}
						
						$lat="";
						$lon="";
						if(isset($obj->longitude)){		
							$lon=$obj->longitude;
						}
						if(isset($obj->latitude)){		
							$lat=$obj->latitude;
						}
	

						header('Content-type: application/xml');
						$xml  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
						$xml .= '			<ns3:WeatherScenarioSimpleResponseMessage xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag">';
						$xml .= '				<latitude>'.$lat.'</latitude>';
						$xml .= '				<longitude>'.$lon.'</longitude>';
						$xml .= '				<startTime>'.$startTime.'</startTime>';
						$xml .= '				<endTime>'.$endTime.'</endTime>';
						
						for( $nF = 0; $nF < count($aWCode); $nF++ )
							{
								$xml .= '				<weatherVariable>'.$aWCode[$nF].'</weatherVariable>';
							}
						$xml .= '				<blockSeparator>'.$blSeparator.'</blockSeparator>';
						$xml .= '				<decimalSeparator>'.$decSeparator.'</decimalSeparator>';
						$xml .= '				<tokenSeparator>'.$toSeparator.'</tokenSeparator>';
						$xml .= '				<values>'.$outcsv.'</values>';
						$xml .= '			</ns3:WeatherScenarioSimpleResponseMessage>';
					}
				else
					{
						header('Content-type: application/xml');
						$xml  = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
						$xml .= '			<ns3:WeatherScenarioSimpleResponseMessage xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag">';
						$xml .= '				<latitude>'.$lat.'</latitude>';
						$xml .= '				<longitude>'.$lon.'</longitude>';
						$xml .= '				<startTime>'.$startTime.'</startTime>';
						$xml .= '				<endTime>'.$endTime.'</endTime>';
						
						for( $nF = 0; $nF < count($aWCode); $nF++ )
							{
								$xml .= '				<weatherVariable>'.$aWCode[$nF].'</weatherVariable>';
							}
						
						$xml .= '				<blockSeparator>'.$blSeparator.'</blockSeparator>';
						$xml .= '				<decimalSeparator>'.$decSeparator.'</decimalSeparator>';
						$xml .= '				<tokenSeparator>'.$toSeparator.'</tokenSeparator>';
						$xml .= '				<values></values>';
						$xml .= '			</ns3:WeatherScenarioSimpleResponseMessage>';
					}
				
				return $xml;

			});
			

			$r3->any('/api/diego/*/*', function($var1="0", $var2="0") use ($db) {
									
					$body = file_get_contents("php://input");
					$obj=json_decode($body);
					$pas="no";
					if(isset($obj)){
						if(isset($obj->parola_chiave)){
							$pas=$obj->parola_chiave;
						}
					}

					return '{"1": "'.$var1.'", "2": "'.$var2.'", "password": "'.$pas.'"}';
			});

			$r3->any('/**', function ($url) {
					return '{"ok": false, "msg": "Unvalid request", "url": '.json_encode($url).'}';
			});
		}
	
	public function getWeatherStations($obj)
	{
		$q = "select * from weather_station where 1=1 ";
		$var = array();
		
		if( isset($obj->longitude) && isset($obj->latitude) )
			{
				$q .= " and ST_Distance_Spheroid(geom, st_geomFromText('POINT( '||:lon||' '||:lat||')',4326),'SPHEROID[\"WGS 84\",6378137,298.257223563]')<:dist";
				$q .= " order by ST_Distance_Spheroid(geom, st_geomFromText('POINT( '||:lon||' '||:lat||')',4326),'SPHEROID[\"WGS 84\",6378137,298.257223563]') limit 1";
				
				$var = array(':lon' => $obj->longitude, ':lat' => $obj->latitude, ':dist' => 50000);
			}
		
		$res = $this->db->select($q, $var);
		if( $res['rowCount'] == 0 )
			$res = array('ok' => false, 'data' => array(), 'message' => "No station selected");

		return $res;
	}

	
	public function getWeatherData($obj)
	{
		$aWField = $this->getWeatherParameter($obj);
		
		$res = $this->getWeatherStations($obj);
		if( $res['ok'] )
			{
				$var = array();
				$where = "";
				if( isset($obj->startTime) )
					{
						$where .= " and time_ref >= :startTime";
						$var[':startTime'] = $obj->startTime;
					}
				
				if( isset($obj->endTime) )
					{
						$where .= " and time_ref <= :endTime";
						$var[':endTime'] = $obj->endTime;
					}
				
				$what = "";
				for( $nF = 0; $nF < count($aWField); $nF++ )
					{
						$what .= $aWField[$nF] . ", ";
					}
				
				$q  = "select $what time_ref from weather_data where id_weather_station = :station $where";
				$var[':station'] = $res['data'][0]['id_weather_station'];
				$res_data = $this->db->select($q, $var);
				echo $this->db->getSQL($q,$var);
				
				if( $res_data['rowCount'] == 0 )
					$res_data = array('ok' => false, 'data' => array(), 'message' => "No data available");
			}
		else
			$res_data = $res;
		
		return $res_data;
	}
	
	public function getWeatherParameter($obj, $bSolveCode = true)
	{
		$nVar = count($obj->weatherVariable);
		
		$aWField = array();
		for( $nV = 0; $nV < $nVar; $nV++ )
			{
				$weatherCode = (string) $obj->weatherVariable->$nV;
				
				if( $bSolveCode )
					{
						switch( $weatherCode )
							{
								case '0 0 0': $aWField[] = 'tavg'; break;
								case '0 0 4': $aWField[] = 'tmin'; break;
								case '0 0 5': $aWField[] = 'tmax'; break;
								case '0 1 1': $aWField[] = 'hravg'; break;
								case '0 1 8': $aWField[] = 'psum'; break;
								case '0 4 0': $aWField[] = 'rsum'; break;
								case '0 2 1': $aWField[] = 'wavg'; break;
							}
					}
				else
					$aWField[] = $weatherCode;
			}
		return $aWField;
		
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
