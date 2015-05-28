<?php

/**
 * 
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace smartIPM;
 
class WeatherProvider {

	private $db;
	private $aSetting;

	private $toSeparator  = ";";
	private $blSeparator  = ":::";
	private $decSeparator = ".";

		
    public function __construct($db, $aSetting)
    {
			$this->db=$db;
			$this->aSetting=$aSetting;
    }


		public function exeApi($body){


				
				if($body!=''){
					$obj = $this->prepareInput($body);
					$res_data = $this->getWeatherData($obj);
					
					return $this->prepareOutput($obj, $res_data);
				}
				else{
					return Utils::Array2XML(Array('ok'=>false, 'message'=>'No body payload'),'Response');					
				}				
				
				
		}

	public function prepareInput($body){
		return simplexml_load_string($body);
	}


	public function prepareOutput($obj, $res_data ){
				$lat = "";
				$lon = "";
				if(isset($obj->longitude)){		
					$lon = $obj->longitude;
				}
				if(isset($obj->latitude)){		
					$lat = $obj->latitude;
				}
				$startTime = $obj->startTime;
				$endTime = $obj->endTime;

				$aWField = $this->getWeatherParameter($obj);
				$aWCode  = $this->getWeatherParameter($obj,false);

				if( $res_data['ok'] )
					{
						$outcsv = "";
						
						for( $r = 0; $r < $res_data['rowCount']; $r++ )
							{
								$outcsv .= $res_data['data'][$r]['time_ref'] . $this->toSeparator;
								
								for( $nF = 0; $nF < count($aWField); $nF++ )
									{
										if( $nF < count($aWField) -1 )
											$outcsv .= $res_data['data'][$r][$aWField[$nF]] . $this->toSeparator;
										else
											$outcsv .= $res_data['data'][$r][$aWField[$nF]] . $this->blSeparator;
										
									}
							}

						
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
						$xml .= '				<blockSeparator>'.$this->blSeparator.'</blockSeparator>';
						$xml .= '				<decimalSeparator>'.$this->decSeparator.'</decimalSeparator>';
						$xml .= '				<tokenSeparator>'.$this->toSeparator.'</tokenSeparator>';
						$xml .= '				<values>'.$outcsv.'</values>';
						$xml .= '			</ns3:WeatherScenarioSimpleResponseMessage>';
					}
				else
					{

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
						
						$xml .= '				<blockSeparator>'.$this->blSeparator.'</blockSeparator>';
						$xml .= '				<decimalSeparator>'.$this->decSeparator.'</decimalSeparator>';
						$xml .= '				<tokenSeparator>'.$this->toSeparator.'</tokenSeparator>';
						$xml .= '				<values></values>';
						$xml .= '			</ns3:WeatherScenarioSimpleResponseMessage>';
					}

			return $xml;

	}

	
	public function getWeatherStations($obj)
	{
		$q = "select * from weather_station where 1=1 ";
		$var = array();
		
		if( isset($obj->longitude) && isset($obj->latitude) )
			{
				$q .= " and ST_Distance_Spheroid(geom, st_geomFromText('POINT( '||:lon||' '||:lat||')',4326),'SPHEROID[\"WGS 84\",6378137,298.257223563]')<:dist";
				$q .= " order by ST_Distance_Spheroid(geom, st_geomFromText('POINT( '||:lon||' '||:lat||')',4326),'SPHEROID[\"WGS 84\",6378137,298.257223563]') limit 1";
				
				$var = array(':lon' => $obj->longitude, ':lat' => $obj->latitude, ':dist' => 100000);
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
				//echo "getWeatherData: " . $this->db->getSQL($q,$var);
				
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


?>
