<?php

	require_once 'vendor/autoload.php';
	require_once 'settings.php';

	use smartIPM\FIWARELogin;
	use smartIPM\BasicLogin;

	$db = Dbmng\Db::createDb($aSetting['DB']['DB_DSN'], $aSetting['DB']['DB_USER'], $aSetting['DB']['DB_PASSWD'] );

	$app=new Dbmng\App($db, $aSetting);

  $aPage=Array();

	$aPage['project']="smartIPM";
	$aPage['title']="Home Page";
	$aPage['bootstrap_path']="/libraries/bootstrap/";

	$body="";
	session_start();

	//$login=new smartIPM\BasicLogin($var);
	$login=new smartIPM\FIWARELogin($aSetting['OAUTH2']);


	if(isset($_REQUEST['do_login'])){
		$login->doLogin();
	}
	else if(isset($_REQUEST['do_logout'])){
		$login->doLogout();
	}
	$ret = $login->checkLogin();
	$aPage['nav'][0]['title']='Info';
	$aPage['nav'][0]['link']='?sect=info';

	//$body.='res: '.$ret['ok'].'|msg:'.$ret['message'].'|isAUt'.$login->isAut();
	if(!$login->isAut()){
		$aPage['navRight'][0]['title']='Login';
		$aPage['navRight'][0]['link']='?do_login=true';
	}
	else{
		$aPage['navRight'][0]['title']=' Logout';
		$aPage['navRight'][0]['link']='?do_logout=true';

		$aPage['nav'][1]['title']='Test user';
		$aPage['nav'][1]['link']='?sect=test_user';
		$aPage['nav'][2]['title']='Test DBMNG';
		$aPage['nav'][2]['link']='?sect=test_dbmng';
		$aPage['nav'][3]['title']='Test API';
		$aPage['nav'][3]['link']='?sect=test_api';



		//$body.='Hi '.$login->getUserNameFI()."!";

		if(isset($_REQUEST['sect'])){

			if($_REQUEST['sect']=='test_user'){
				$body.=testUser($login);
			}
			else if($_REQUEST['sect']=='test_dbmng'){
				$body.=testDbmng($app);
			}
			else if($_REQUEST['sect']=='test_api'){
				$body.=testApi($app);
			}
		}
	}

	$aPage['content']=$body;
    $layout = new Dbmng\Layout($aPage);
			
	$html=$layout->getLayout();
	echo $html;

	function testUser($login){

		$body='<h3>User data</h3>'; 


		//$body.='<script src="js/smartIPM.js"></script>';
		//$body.="<script>testAuth('http://auth.ee.fispace.eu:8080/auth/realms/fispace/account/', '".$login->accessToken."');</script>";		
				
		//$url='http://auth.ee.fispace.eu:8080/auth/realms/fispace/account';
		$url = 'http://37.131.251.117:8080/sdi/api/capabilities';
		//$url = 'http://fispace.bo-mo.si:8080/weather-scenario-provider-backend/api/weather-scenario-simple/sample-request?token='.$login->accessToken;
		

		$user_data=$login->fetchUrl($url);
		$body.=("<pre>".print_r($user_data,true)."</pre>");

		//$orion=($login->fetchUrl('http://orion.lab.fi-ware.org:1026/ngsi10/contextEntities/urn:smartsantander:testbed:357'));
		//$body.='<br/><h3>Orion test</h3>';
		//$body.=("<pre>".print_r($orion,true)."</pre>");
		//print_r('a'.$login->fetchUrl('http://orion.lab.fi-ware.org:1026/ngsi10/contextEntities/urn:smartsantander:testbed:357'));
		//print_r($login->getUrlAuth('https://account.lab.fiware.org/user'));

		return $body;
	}

	function testDbmng($app){
		$body='aa';

		

		if(true){

			

		  

			$aForm=array(  
				'table_name' => 'test' ,
					'primary_key'=> array('id'), 
					'fields'     => array(
							'id' => array('label'   => 'ID', 'type' => 'int', 'key' => 1 ) ,
							'name' => array('label'   => 'Name', 'type' => 'varchar')
					),
			);


			$aParam=array();
			$aParam['filters']['id']=1;
			$aParam['filters']['name']='Diego';

			$dbmng=new Dbmng\Dbmng($app->getDb(), $aForm, $aParam);

		}

		return $body;
	}


	function testApi($app){

		$html='test Api';

		$html.='<script src="js/smartIPM.js"></script><div id="test_api"></div>';
		$html.="<script>jQuery(function(){testApi();});</script>";	



		return $html;
	}

?>
