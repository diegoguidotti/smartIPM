<?php

	require_once 'vendor/autoload.php';
	require_once 'settings.php';

	use smartIPM\FIWARELogin;
	use smartIPM\BasicLogin;
	use smartIPM\ModelUtil;

	session_start();
	

	$offline=false;

	$db = Dbmng\Db::createDb($aSetting['DB']['DB_DSN'], $aSetting['DB']['DB_USER'], $aSetting['DB']['DB_PASSWD'] );

	$app=new Dbmng\App($db, $aSetting);

  $aPage=Array();

	$aPage['project']="smartIPM";
	$aPage['title']="Home Page";

	if($offline)
		$aPage['bootstrap_path']="/libraries/bootstrap/";
	else
		$aPage['bootstrap_path']="online";

	$body="";


	//$login=new smartIPM\BasicLogin($var);
	$login=new smartIPM\FIWARELogin($db, $aSetting['OAUTH2']);


	if(isset($_REQUEST['do_login'])){
		$login->doLogin();
	}
	else if(isset($_REQUEST['do_logout'])){
		$body.='';
		$login->doLogout();
	}
	$ret = $login->checkLogin();
	$aPage['nav'][0]['title']='Info';
	$aPage['nav'][0]['link']='?sect=info';

	//$body.='res: '.$ret['ok'].'|msg:'.$ret['message'].'|isAUt'.$login->isAut();


	$body.='<script type="text/javascript"    src="js/flot/jquery.flot.min.js"></script>';
	$body.='<script type="text/javascript"    src="js/flot/jquery.flot.time.min.js"></script>';
	$body.='<script type="text/javascript"    src="js/flot/jquery.flot.selection.min.js"></script>';

	$body.='<link rel="stylesheet" href="css/smartIPM.css" /> ';

	$logged_in=$login->isAut();
	if($offline){
		$logged_in=true;
	}

	if(!$logged_in)
		{
			$aPage['navRight'][0]['title']='Login';
			$aPage['navRight'][0]['link']='?do_login=true';
		}
	else
		{
			$acc=$login->getAccount();


			//$body.='<pre>'.print_r($acc,true)."</pre>";


			//check role;
			$isAdmin=false;

			$aPage['navRight'][0]['title']='Hi '.$acc->firstName." ".$acc->lastName;
			if($acc->roles){
				foreach($acc->roles as $r ){
					$role;
					if(is_object($r)){
						$role=$r->role;
					}
					else{
						$role=$r['role'];
					}
					if($role=='admin'){
						$isAdmin=true;
					}
				}
			}			
			

			$aPage['navRight'][1]['title']='Logout';
			$aPage['navRight'][1]['link']='?do_logout=true';

			$aPage['nav'][0]['title']='webGIS';
			$aPage['nav'][0]['link']='?sect=web_gis';

			$aPage['nav'][1]['title']='dashboard';
			$aPage['nav'][1]['link']='?sect=dashboard';

			if($isAdmin){

				$aPage['nav'][3]['title']='Test Oauth2';
				$aPage['nav'][3]['link']='?sect=test_user';
				
				$aPage['nav'][4]['title']='Test API 2';
				$aPage['nav'][4]['link']='?sect=test_api2';

				$aPage['nav'][5]['title']='Test Model';
				$aPage['nav'][5]['link']='?sect=test_model';

				$aPage['nav'][6]['title']='Test Model Manager';
				$aPage['nav'][6]['link']='?sect=test_model_manager';

				$aPage['nav'][7]['title']='Model Builder';
				$aPage['nav'][7]['link']='?sect=model_builder';
			}
			
						

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
						$body .= testWebGIS($app, $offline);
					}
					else if($_REQUEST['sect']=='dashboard'){
						$aPage['title']='Dashboard';
						$body .= testDashboard($app);
					}
					else if($_REQUEST['sect']=='model_builder'){
						$aPage['title']='Model Builder';
						$body .= testModelBuilder($app);
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
			$html.='<pre>'.print_r($ret,true).'</pre>';

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
		
		//print_r(ModelUtil::sinMinMax(8, 20, 10, 25));
		//print_r(ModelUtil::hourDegree( 8, 10, 20, 25, 8, 11 ));
		return $html;
	}
	
	function testModelManager($app){
		$html='test Model Manager';
		$html.='<script src="js/smartIPM.js"></script>
						<div id="test_model_manager"></div>';
		$html.="<script>jQuery(function(){testModelManager();});</script>";	
		return $html;
	}

	function testWebGIS($app, $offline){
		$html='';
		if($offline){
			$html.='<script src="/libraries/leaflet-0.7.3/leaflet.js"></script>';
			$html.='<link href="/libraries/leaflet-0.7.3/leaflet.css" rel="stylesheet" /> ';
		}
		else{
			$html.='<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>';
			$html.='<link href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" rel="stylesheet" /> ';
		}

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

	function testDashboard($app){

		$html="";
		$html='<div id="dashboard_container"></div>';
		$html.='<script src="js/smartIPM.js"></script>';
		$html.="<script>jQuery(function(){init_dashboard();});</script>";	
		return $html;
	}

	function testModelBuilder($app){
		$html='We are working on it...';
		return $html;
	}

?>
