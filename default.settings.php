<?php

	

	$aSetting=Array();
	$aSetting['OAUTH2']['CLIENT_ID']="insert_user_id";
	$aSetting['OAUTH2']['CLIENT_SECRET']="insert_client_secret";
	$aSetting['OAUTH2']['REDIRECT_URI']="http://localhost/smartIPM/";
	$aSetting['OAUTH2']['AUTHORIZATION_ENDPOINT']="http://auth.ee.fispace.eu:8080/auth/realms/fispace/tokens/login";
	$aSetting['OAUTH2']['TOKEN_ENDPOINT']="http://auth.ee.fispace.eu:8080/auth/realms/fispace/tokens/access/codes";
	$aSetting['OAUTH2']['ACCOUNT_ENDPOINT']="http://auth.ee.fispace.eu:8080/auth/realms/fispace/account";
	$aSetting['OAUTH2']['LOGOUT_ENDPOINT']="http://auth.ee.fispace.eu:8080/auth/realms/fispace/tokens/logout";

	$aSetting['DB']['DB_DSN']="pgsql:user=xxx;dbname=ddd;password=zzz";
	$aSetting['DB']['DB_USER']="xxx";
	$aSetting['DB']['DB_PASSWD']="zzz";

?>
