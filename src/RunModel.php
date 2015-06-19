<?php

/**
 * 
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace smartIPM;
 
class RunModel {

	private $db;
	private $aSetting;

		
    public function __construct($db, $aSetting)
    {
			$this->db=$db;
			$this->aSetting=$aSetting;
    }


		public function exeApi($body){

			$obj = $this->prepareInput($body);

			if( isset($obj->WeatherData->WeatherScenarioSimpleResponseMessage) )
					{
						$objWeather = $obj->WeatherData->WeatherScenarioSimpleResponseMessage;						
					}
			elseif( isset($obj->WeatherData->capabilities) )
				{
					//print_r($obj->WeatherData->capabilities);
					$uri = $obj->WeatherData->capabilities->uri;
					$weather_obj = $obj->WeatherData->capabilities->payload->WeatherScenarioSimpleRequestMessage;
					
					$xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
					$xml .= '<ns3:WeatherScenarioSimpleRequestMessage xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag">';
					$xml .= '	<latitude>'.$weather_obj->latitude.'</latitude>';
					$xml .= '	<longitude>'.$weather_obj->longitude.'</longitude>';
					$xml .= '	<startTime>'.$weather_obj->startTime.'</startTime>';
					$xml .= '	<endTime>'.$weather_obj->endTime.'</endTime>';
					$xml .= '	<weatherVariable>'.$weather_obj->weatherVariable.'</weatherVariable>';
					$xml .= '</ns3:WeatherScenarioSimpleRequestMessage>';
					
					//echo $xml;
					$aBody = Utils::fetchUrl($uri, $xml);
					if( $aBody['ok'] )
						$objWeather = simplexml_load_string($aBody['body']);
					else	
						$objWeather = json_decode(json_encode($aBody), FALSE); 
					//print_r($objWeather);
				}
				
				$objModel = $obj->PestModel;
				$aModel = (array) $objModel;
				
				if( !isset($objWeather->ok) )
					{
						// get the weather value from the WeatherScenarioSimpleResponseMessage
						$value = $objWeather->values;
						
						$aWeather = array();
						$aResult  = array();
						if( strlen($value) != 0 )
							{
								$aWeather = Utils::CSV2Array($value, $objWeather->blockSeparator, $objWeather->tokenSeparator);
								$aResult = $this->runPestModel($aWeather, $aModel);
							}
						else
							{
								$aResult['ok'] = 0;
								$aResult['message'] = "There are no weather data";
							}
					}
				else
					{
						$aResult['ok'] = 0;
						$aResult['message'] = $objWeather->message;
					}
				

				return $this->prepareOutput($obj, $aResult);
		}



	public function prepareInput($body){
		return simplexml_load_string($body);
	}


	public function prepareOutput($obj, $aResult){


		$xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
		$xml .= '<RunPestModelResponseMessage xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag" xmlns:nsipm="http://www.smartIPM.eu/schema">';

				
						//print_r($obj);
						$weather_obj = $obj->WeatherData->WeatherScenarioSimpleResponseMessage;
						$model_obj   = $obj->PestModel;
						
						

						$xml .= '<WeatherData>';
						$xml .= '<WeatherScenarioSimpleResponseMessage xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag">'; 
						$xml .= '<latitude>'.$weather_obj->latitude.'</latitude>';
						$xml .= '<longitude>'.$weather_obj->longitude.'</longitude>';
						$xml .= '<startTime>'.$weather_obj->startTime.'</startTime>';
						$xml .= '<endTime>'.$weather_obj->endTime.'</endTime>';
						
						for( $nV = 0; $nV < count($weather_obj->weatherVariable); $nV++ )
							{
								$xml .= '<weatherVariable>'.$weather_obj->weatherVariable[$nV].'</weatherVariable>';
							}
						$xml .= '</WeatherScenarioSimpleResponseMessage>';
						$xml .= '</WeatherData>';
						$xml .= '<PestModel>';
						$xml .= '<lowerThreshold>'.$model_obj->lowerThreshold.'</lowerThreshold>';
						$xml .= '<upperThreshold>'.$model_obj->upperThreshold.'</upperThreshold>';
						$xml .= '<requiredDayDegree>'.$model_obj->requiredDayDegree.'</requiredDayDegree>';
						
						$modelResult = Utils::Array2XML($aResult,'ModelResult', false);
						
						$xml .= '<values>'.$modelResult.'</values>';
						$xml .= '</PestModel>';
	
				$xml .= '</RunPestModelResponseMessage>';
				return $xml;		
	}
	


	/* get an array return an array */
	public function runPestModel($aWeather, $aModel)
	{
		$Tsum = 0;
		$perc = 0;
		
		$lt = $aModel['lowerThreshold'];
		$req = $aModel['requiredDayDegree'];
		$values='';
		$sepVal=';';
		$sepRow=':::';

		$header	= ("Cumulated".$sepVal."Percentage");
		$events = Array(
			Array('label'=>'Completed Date', 'value'=>'') 
		);
		
		for( $w = 0; $w < count($aWeather); $w++ )
			{
				$temp = $aWeather[$w][1];
				
				if( $temp > $lt )
					$Tsum += $temp-$lt;

				$perc=$Tsum/$req;
				if($perc>1){
					$perc=1;
					if($events[0]['value']==''){
						$events[0]['value']=$aWeather[$w][0];
					}
				}

				$values+=$aWeather[$w][0].$sepVal.$Tsum.$sepVal.($perc).$sepRow;
			}
		
		$aRet= array('ok'=> true, 'day_degree' => $Tsum,  'events'=> $events, 'results'=> Array('headers'=>$header, 'values'=>$values), 'message' => 'The model has been runned successully!');

		

		return $aRet;
	}


	

}

