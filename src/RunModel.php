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
				
/*
				// get the weather value from the WeatherScenarioSimpleResponseMessage
				$value = $objWeather->values;
				

				$aWeather = Utils::CSV2Array($value, $objWeather->blockSeparator, $objWeather->tokenSeparator);

				$aResult = $this->runPestModel($aWeather, $aModel);
*/
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

					
				$xml .= '<Message>'.$aResult['message'].'</Message>';
				$xml .= '</RunPestModelResponseMessage>';
				return $xml;		
	}
	


	/* get an array return an array */
	public function runPestModel($aWeather, $aModel)
	{
		$Tsum = 0;
		$mod_res = 0;
		


		$lt = $aModel['lowerThreshold'];
		$req = $aModel['requiredDayDegree'];
		$formula=null;
		if(isset($aModel['formula'])){
			$formula=$aModel['formula'];
		}

/*
		echo "Formula".$formula;
		echo "LT:".$lt;
		echo "REQ:".$lt;
		echo "CPINT:".count(count($aWeather));
*/



		$values='';
		$sepVal=';';
		$sepRow=':::';

		$header	= ("Cumulated".$sepVal."Percentage");
		if($formula!=null){
			$header	= ("Daily".$sepVal."Cumulated");
		}
		$events = Array(
			Array('label'=>'Completed Date', 'value'=>'') 
		);
		
		if(count($aWeather)<=1){
			$aRet= array('ok'=> false, 'message' => 'There are no weather data to run the model');
		}
		else{	
		
			$allOk=true;

			
			
			for( $w = 0; $w < count($aWeather); $w++ )
				{
					

					if(count($aWeather[$w])==0){
						$allOk=false;
					}
					else{

						$temp = $aWeather[$w][1];

						//echo "Temp:".$temp."<br/>";


						if($formula!=null){

							
							$mod_res=$this->calc($formula, Array(':tmed'=>$temp));
							//echo "form:".$formula."<br/>res:".$mod_res."<br/>";
							if( $mod_res < $lt ){
								$mod_res=0;
							}

							$Tsum+=$mod_res;

							$values.=$aWeather[$w][0].$sepVal.($mod_res).$sepVal.$Tsum.$sepRow;

						}
						else{
							if( $temp > $lt ){
								$Tsum += $temp-$lt;
							}
							if($req>0)
								$mod_res=$Tsum/$req;
							else
								$mod_res=$Tsum;

							if($mod_res>1 && $req>0){
								$mod_res=1;
								if($events[0]['value']==''){
									$events[0]['value']=$aWeather[$w][0];
								}
							}
							$values.=$aWeather[$w][0].$sepVal.$Tsum.$sepVal.($mod_res).$sepRow;

						}
						
					}
				}
		
			$aRet= array('ok'=> true, 'day_degree' => $Tsum,  'events'=> $events, 'results'=> Array('headers'=>$header, 'values'=>$values), 'message' => 'The model has been runned successully!', 'allok'=> $allOk);
	}

		

		return $aRet;
	}


	function calc($equation, $aVar){

		while (list($key, $val) = each( $aVar)) {
			$equation= str_replace($key, $val, $equation);
				//echo "$key => $val<br/>";
		}
		

    // Remove whitespaces
    $equation = preg_replace('/\s+/', '', $equation);
    //echo $equation."<br/>";

    $number = '((?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?|pi|π|x)'; // What is a number

    $functions = '(?:sinh?|cosh?|tanh?|acosh?|asinh?|atanh?|exp|log(10)?|deg2rad|rad2deg
|sqrt|pow|abs|intval|ceil|floor|round|(mt_)?rand|gmp_fact)'; // Allowed PHP functions
    $operators = '[\/*\^\+-,]'; // Allowed math operators
    $regexp = '/^([+-]?('.$number.'|'.$functions.'\s*\((?1)+\)|\((?1)+\))(?:'.$operators.'(?1))?)+$/'; // Final regexp, heavily using recursive patterns

    if (preg_match($regexp, $equation))
    {
        $equation = preg_replace('!pi|π!', 'pi()', $equation); // Replace pi with pi function        
        eval('$result = '.$equation.';');
    }
    else
    {
        $result = false;
    }
    return $result;
}

}

