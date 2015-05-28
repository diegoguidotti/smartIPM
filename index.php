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
	//$aPage['bootstrap_path']="/libraries/bootstrap/";
	$aPage['bootstrap_path']="online";

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
	if(!$login->isAut())
		{
			$aPage['navRight'][0]['title']='Login';
			$aPage['navRight'][0]['link']='?do_login=true';
		}
	else
		{
			$aPage['navRight'][0]['title']=' Logout';
			$aPage['navRight'][0]['link']='?do_logout=true';

			$aPage['nav'][1]['title']='Test Oauth2';
			$aPage['nav'][1]['link']='?sect=test_user';
			//$aPage['nav'][2]['title']='Test DBMNG';
			//$aPage['nav'][2]['link']='?sect=test_dbmng';
			$aPage['nav'][3]['title']='Test API';
			$aPage['nav'][3]['link']='?sect=test_api';

			$aPage['nav'][4]['title']='Test API 2';
			$aPage['nav'][4]['link']='?sect=test_api2';

			$aPage['nav'][5]['title']='Test Model';
			$aPage['nav'][5]['link']='?sect=test_model';

			$aPage['nav'][6]['title']='Test Model Manager';
			$aPage['nav'][6]['link']='?sect=test_model_manager';


			$aPage['nav'][6]['title']='webGIS';
			$aPage['nav'][6]['link']='?sect=web_gis';

			//$body.='Hi '.$login->getUserNameFI()."!";

			if(isset($_REQUEST['sect']))
				{
					if($_REQUEST['sect']=='test_user'){
						$body .= testUser($login);
					}
					else if($_REQUEST['sect']=='test_dbmng'){
						$body .= testDbmng($app);
					}
					else if($_REQUEST['sect']=='test_api'){
						$body .= testApi($app);
					}
					else if($_REQUEST['sect']=='test_api2'){
						$body .= testApi2($app);
					}
					else if($_REQUEST['sect']=='test_model'){
						$body .= testModel($app);
					}
					else if($_REQUEST['sect']=='test_model_manager'){
						$body .= testModelManager($app);
					}
					else if($_REQUEST['sect']=='web_gis'){
						$aPage['title']='WebGIS';
						$body .= testWebGIS($app);
					}
				}
			else
				{
					$body .= getHome();
				}
		}

		$aPage['content']=$body;
    $layout = new Dbmng\Layout($aPage);
			
	$html=$layout->getLayout();
	echo $html;

	function getHome(){
		$html='Welcome to the smartAgriFood project smartIPM. ';
		return $html;
	}


	function testUser($login){

		$html='<h3>User data</h3>'; 

		$html.='<a href="?sect=test_user&check_url=http://37.131.251.117:8080/sdi/api/capabilities">Check http://37.131.251.117:8080/sdi/api/capabilities</a><br/>';
		$html.='<a href="?sect=test_user&check_url=http://37.131.251.117:8080/sdi/api/capabilities/7/use">Check http://37.131.251.117:8080/sdi/api/capabilities/7/use</a><br/>';



		$html.='<a href="?sect=test_user&check_url=http://auth.ee.fispace.eu:8080/auth/realms/fispace/account">Check http://auth.ee.fispace.eu:8080/auth/realms/fispace/account</a><br/>';


		if(isset($_REQUEST['check_url'])){

			$url=$_REQUEST['check_url'];
			$html.='<h3>Checking url</b>: '.$url."</h3>";


			$ret=$login->fetchUrl($url, true);

			$html.=($ret);
		}


		return $html;
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

	function testApi2($app){

		$html='test Api 2';
		$html.='<script src="js/smartIPM.js"></script><div id="form_test_api2"></div><div id="test_api2"></div>';
		$html.="<script>jQuery(function(){testApi2();});</script>";	
		
		return $html;
	}

	function testModel($app){
		$html='test Model';
		$html.='<script src="js/smartIPM.js"></script>
						<p>Weather parameters</p><div id="form_test_weather"></div>
						<p>Model parameters</p><div id="form_test_model"></div>
						<p>Result</p><div id="test_model"></div>';
		$html.="<script>jQuery(function(){testModel();});</script>";	

		return $html;
	}
	
	function testModelManager($app){
		$html='test Model Manager';
		$html.='<script src="js/smartIPM.js"></script>
						<div id="test_model_manager"></div>';
		$html.="<script>jQuery(function(){testModelManager();});</script>";	

		return $html;
	}

	function testWebGIS($app){
		$html='';
		$html.='<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>';
		$html.='<link href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" rel="stylesheet" /> ';
		$html.='<script src="js/smartIPM.js"></script>

				<div style="height:500px;" class="col-md-9 col-xs-9" id="smartIPM_map"></div>
					<div class="col-md-3 col-xs-3"  id="side_container">
						<div class=""  id="list_models"></div>
						<div class=""  id="smartIPM_results"><h3>Res</h3></div>
					</div>';

		//$aPage['sidebar']="<div id='list_models'></div>";
		$html.="<script>jQuery(function(){init_map();});</script>";	

		
		return $html;
	}
?>
