<?php

/**
 * 
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace smartIPM;
 
class ModelManager {

	private $db;
	private $aSetting;

		
    public function __construct($db, $aSetting)
    {
			$this->db=$db;
			$this->aSetting=$aSetting;
    }


		public function exeApi($obj){
			$q  = "select m.id_model, m.model_name, m.id_crop, c.crop_name, m.id_pest, p.pest_name, m.model_description, m.low_threshold, m.up_threshold, m.biofix 
						from model m left join crop c on c.id_crop = m.id_crop left join pest p on p.id_pest = m.id_pest";
			$res_data = $this->db->select($q, Array());
				
			if( $res_data['rowCount'] == 0 )
				$res_data = array('ok' => false, 'data' => array(), 'message' => "There are no model available");
			
			//print_r($res_data);
			return $this->generateResponse($res_data);

		}

		public function generateResponse($aRes){
			$xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
			$xml .= '<RunModelManagerResponse xmlns:ns2="http://www.limetri.eu/schemas/ygg" xmlns:ns3="http://www.fispace.eu/domain/ag" xmlns:nsipm="http://www.smartIPM.eu/schema">';
			for( $nM = 0; $nM < $aRes['rowCount']; $nM++ )
				{
					$xml .= '<model><id>'.$aRes['data'][$nM]['id_model'].'</id><model_name>'.$aRes['data'][$nM]['model_name'].'</model_name><model_description>'.$aRes['data'][$nM]['model_description'].'</model_description>';
					$xml .= '<crop><id_crop>'.$aRes['data'][$nM]['id_crop'].'</id_crop><crop_name>'.$aRes['data'][$nM]['crop_name'].'</crop_name></crop>';
					$xml .= '<pest><id_pest>'.$aRes['data'][$nM]['id_pest'].'</id_pest><pest_name>'.$aRes['data'][$nM]['pest_name'].'</pest_name></pest>';
					$xml .= '<lowerThreshold>'.$aRes['data'][$nM]['low_threshold'].'</lowerThreshold>';
					$xml .= '<upperThreshold>'.$aRes['data'][$nM]['up_threshold'].'</upperThreshold>';
					$xml .= '<requiredDayDegree>'.$aRes['data'][$nM]['biofix'].'</requiredDayDegree>';
					$xml .= '</model>';
				}
			
			$xml .= '</RunModelManagerResponse>';
			//$xml .= print_r($aRes);
			return $xml;
			
		}
	

}

