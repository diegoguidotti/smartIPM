<?php

	require_once 'vendor/autoload.php';
	require_once 'settings.php';


	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
		header('Access-Control-Allow-Headers: X-Requested-With, Content-Type');
	}
	else {
		header('Access-Control-Allow-Origin: *');
		
	}


	$db = Dbmng\Db::createDb($aSetting['DB']['DB_DSN'], $aSetting['DB']['DB_USER'], $aSetting['DB']['DB_PASSWD'] );
	$api = new smartIPM\APIManager($db, $aSetting);


	$api->exeRest();

?>
