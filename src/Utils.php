<?php

namespace smartIPM;
 
class Utils {


	public static function CSV2Array($value, $rowSep=':::', $colSep=";")
	{
		// transform the weather value from string to array
		$value = substr($value, 0, strlen($value)-3);
		$aRows = explode($rowSep, $value);
		
		for( $n = 0; $n < count($aRows); $n++ )
			{
				$aRows[$n] = explode($colSep, $aRows[$n]);
			}
		
		return $aRows;
	}


	public static function Array2Xml($aArray, $base_element, $header=true) {

		$sxml='';	
		if($header){
			$sxml.='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
		}
		$sxml.='<'.$base_element.'></'.$base_element.'>';

		 $xml=new \SimpleXMLElement($sxml);

		self::Array2XmlBasic($aArray, $xml);

		if($header){
			return $xml->asXML();;
		}
		else{
			$dom = dom_import_simplexml($xml);
			return $dom->ownerDocument->saveXML($dom->ownerDocument->documentElement);
		}
	}	

	public static function Array2XmlBasic($aArray, &$xml) {

	

    foreach($aArray as $key => $value) {
        if(is_array($value)) {
            if(!is_numeric($key)){
                $subnode = $xml->addChild("$key");
                self::Array2XmlBasic($value, $subnode);
            }
            else{
                $subnode = $xml->addChild("item$key");
                self::Array2XmlBasic($value, $subnode);
            }
        }
        else {
            $xml->addChild("$key",htmlspecialchars("$value"));
        }
    }

		
}


	public static function fetchUrl($url, $request, $debug=false){
		$ret_dbg="";
		$url= trim($url);
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL,$url);
		curl_setopt($ch, CURLOPT_USERAGENT, 'cURL Request');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

			
		//curl_setopt($ch, CURLOPT_POST, 1);
		//curl_setopt($ch, CURLOPT_POSTFIELDS,$vars);  //Post Fields
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_VERBOSE, 1);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
		
		$headers = array();
		//$headers[] = 'X-Auth-Token: '.$this->accessToken;
		$headers[] = 'Content-Type: application/xml';
		$headers[] = 'Accept: application/xml';
		//$headers[] = 'Authorization: Bearer '.$this->accessToken;
	
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		$response = curl_exec ($ch);
		
		$aBody = array();
		if($errno = curl_errno($ch)) 
			{
				$aBody['ok'] = 0;
				$aBody['message'] = curl_strerror($errno);
			}
		else
			{
				// Then, after your curl_exec call:
				$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
				$header = substr($response, 0, $header_size);
				$body = substr($response, $header_size);

				curl_close ($ch);
				
				$aBody['ok'] = 1;
				$aBody['body'] = $body;
				if( $debug )
					{
						$aBody['debug'] ='<h3>Header</h3><pre>'.$header.'</pre><h3>Body</h3><pre>'.$body.'</pre>';
					}
			}
		return $aBody;
	}


}

?>
