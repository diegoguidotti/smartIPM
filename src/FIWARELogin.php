<?php

/**
 * Login management class
 * 
 * @author Diego Guidotti <diego.guidotti@gmail.com>
 */

namespace smartIPM;

 
class FIWARELogin {


	private $client;
	private $var;
	private $isAut;	
	private $accessToken;
	private $account;
	private $db;

//https://bitbucket.org/fispace/archetypes/src/9d48242877293ebdd6d040d1453b876ba37cb2dc/app-widget/src/main/resources/?at=default

	public function __construct($db, $var)
    {
			$this->var=$var;
			$this->db=$db;
				
			$this->client = new \OAuth2\Client($this->var['CLIENT_ID'], $this->var['CLIENT_SECRET']);
			$this->isAut=false;
			$this->account=Array();
    }

    public function doLogout(){
		 

    	unset($_SESSION['smartIPM_access_token']);
    	unset($_SESSION['smartIPM_account']);
    }

    public function doLogin(){
		$auth_url = $this->client->getAuthenticationUrl($this->var['AUTHORIZATION_ENDPOINT'], $this->var['REDIRECT_URI']);
	    header('Location: ' . $auth_url);
	    die('Redirect');
    }


    public function checkLogin(){
    	
    	$ret2=array();
    	$msg="";

		//check if the session exists
		if(isset($_SESSION['smartIPM_access_token'])){
			$aut=true;
			$this->accessToken=$_SESSION['smartIPM_access_token'];
			$this->account=json_decode($_SESSION['smartIPM_account']);

			

			$msg="session exist";
		}
		else{
			//if exist a code var check the code
			if(isset($_GET['code'])){
				$ret=$this->oauth2Check($_GET['code']);				
				$aut=$ret['ok'];
					$msg="";
				if(isset($ret['message']))
					$msg=$ret['message'];
				$msg.="get ok";
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

    public  function oauth2Check($code){

    	$ret=array();

		$params = array('code' => $code, 'redirect_uri' => $this->var['REDIRECT_URI']);
		$response = $this->client->getAccessToken($this->var['TOKEN_ENDPOINT'], 'authorization_code', $params);
    	//print_r($response);

        if(isset($response['result']['error'])){
        	$ret['ok']=false;	
            $ret['message']=($response['result']['error_description']);
    		$this->isAut=false;
        }
        else{
        	$ret['ok']=true;	

					//Use the following for FIWare KeyRock
					//$this->access_token=$response['info']['access_token'];		
					$this->access_token=$response['result']['access_token'];
				 
	 	     	$this->isAut=true;			
        	$_SESSION['smartIPM_access_token']=$this->access_token;


					//echo('Account endpoint: '.$this->var['ACCOUNT_ENDPOINT']);
					//echo('<br/>Token: '.$this->access_token);

					$this->account=$this->fetchUrl($this->var['ACCOUNT_ENDPOINT'], false, $this->access_token);

					//print_r($this->account);

					$res = $this->db->select("select * from users WHERE id_user=:id ", Array(":id"=>$this->account->id));					

					if(count($res['data'])==0){
						$res = $this->db->select("insert into users (id_user,username, email, last_login) values (:id,:username, :email, Now()) ", 
							Array(":id"=>$this->account->id,":username"=>$this->account->username,":email"=>$this->account->email)
						);				
					}
					else{
						$res = $this->db->select("update users set last_login=Now() WHERE id_user=:id;", 
							Array(":id"=>$this->account->id)
						);										
						$res = $this->db->select("select role from users_role WHERE id_user=:id;", 
							Array(":id"=>$this->account->id)
						);	
						$this->account->roles=$res['data'];

					}
					//print_r($res);

					//print_r($this->account);
					$_SESSION['smartIPM_account']=json_encode($this->account);

        	//echo "Setted session to".$this->access_token;

      	}
      	return $ret;
    }



    public function fetchUrl($url, $debug=false, $accessToken=null){
			$ret_dbg="";

			if($accessToken==null){
				$accessToken=$this->accessToken;
			}

			/*
			echo("<pre>".print_r($_SESSION,true)."</pre>");
			$params = array('refresh_token' => $_SESSION['smartIPM_refresh_token']);
			echo("<pre>".print_r($params,true)."</pre>");
			$response = $this->client->getAccessToken($this->var['TOKEN_ENDPOINT'], 'refresh_token', $params);
			if($debug){
				$ret_dbg.=("<pre>".print_r($response,true)."</pre>");

			}
			*/

    	$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL,$url);
			curl_setopt($ch, CURLOPT_USERAGENT, 'cURL Request');
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

				
			//curl_setopt($ch, CURLOPT_POST, 1);
			//curl_setopt($ch, CURLOPT_POSTFIELDS,$vars);  //Post Fields
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_HEADER, 1);

			$headers = array();
			//$headers[] = 'X-Auth-Token: '.$accessToken;
			$headers[] = 'Content-Type: application/json';
			$headers[] = 'Accept: application/json';
			$headers[] = 'Authorization: Bearer '.$accessToken;
		
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			$response = curl_exec ($ch);

			// Then, after your curl_exec call:
			$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
			$header = substr($response, 0, $header_size);
			$body = substr($response, $header_size);

			curl_close ($ch);
			if($debug){
				
				$ret_dbg.='<h3>URL</h3>'.$url;
				$ret_dbg.='<h3>Token</h3>'.$accessToken;
				$ret_dbg.='<h3>Header</h3><pre>'.$header.'</pre>';
				$ret_dbg.='<h3>Body</h3><pre>'.$body.'</pre>';
				return $ret_dbg;
			}
			else{
				return  json_decode($body);
			}
    }

    public function getAccount(){
			return $this->account;
		}

    public function isAut(){
    	return $this->isAut;
    }

}
