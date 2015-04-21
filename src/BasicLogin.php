<?php

/**
 * Login management class
 * 
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace smartIPM;

 
class BasicLogin {

	private $var;
	private $isAut;	

	public function __construct($var)
    {
				
		$this->isAut=false;
		$this->var=$var;
    }

    public function doLogout(){
    	unset($_SESSION['smartIPM_access_token']);
    }

    public function doLogin(){
    	if(true){
			$this->access_token='xxx';
	     	$this->isAut=true;
	    	$_SESSION['smartIPM_access_token']=$this->access_token;
	    }

    }


    public function checkLogin(){
    	
    	$ret2=array();
    	$msg="";

		//check if the session exists
		if(isset($_SESSION['smartIPM_access_token'])){
			$aut=true;
			$this->accessToken=$_SESSION['smartIPM_access_token'];

			$msg="session exist";
		}
		else{
			//if exist a code var check the code
			if(false){
			}
			else{
				$aut=false;
				$msg.="No code";
    		}
		}
		$ret2['ok']=$aut;
		$ret2['message']=$msg;
		$this->isAut=$aut;
		return $ret2;
    }




    public function fetchUrl($url){

    	$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL,$url);
		//curl_setopt($ch, CURLOPT_POST, 1);
		//curl_setopt($ch, CURLOPT_POSTFIELDS,$vars);  //Post Fields
		curl_setopt($ch, CURLOPT_USERAGENT, 'cURL Request');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
     

		$headers = array();
		$headers[] = 'X-Auth-Token: '.$this->access_token;
		$headers[] = 'Content-Type: application/json';
		$headers[] = 'Accept: application/json';
		

		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		$server_output = curl_exec ($ch);
		curl_close ($ch);
		return  json_decode($server_output);
    }

    public function isAut(){
    	return $this->isAut;
    }

}