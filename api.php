<?php

	require_once 'vendor/autoload.php';
	require_once 'settings.php';

	$db = Dbmng\Db::createDb($aSetting['DB']['DB_DSN'], $aSetting['DB']['DB_USER'], $aSetting['DB']['DB_PASSWD'] );
	$api = new smartIPM\APIManager($db, $aSetting);


	$api->exeRest();

?>
