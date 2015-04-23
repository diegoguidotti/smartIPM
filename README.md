# smartIPM
smartIPM FiWare project

## Install
	git clone https://github.com/diegoguidotti/smartIPM.git
	cd  smartIPM
	composer update
	cp default.settings settings
	nano settings #update the setting configuration

	#php5-curl and mod_rewrite are pre-requisites for the oauth2 client and REST api
	apt-get install php5-curl


	a2enmod rewrite
	sudo nano /etc/apache2/sites-enabled/000-default
			AllowOverride All   (in the directory /var/www/)

	service apache2 restart


 

