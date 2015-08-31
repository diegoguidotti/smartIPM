CREATE TABLE weather_station
(
  id_weather_station serial NOT NULL,
  station_name character varying,
  geom geometry,
  weather_source character varying,
  weather_network character varying,
  station_code character varying,
  time_period integer,
	date_from timestamp with time zone,
	date_to timestamp with time zone,
  CONSTRAINT weather_station_pkey PRIMARY KEY (id_weather_station)
);


CREATE TABLE weather_data
(
  id_weather_data serial NOT NULL,
  id_weather_station integer NOT NULL,
	time_ref timestamp with time zone,
  tmin double precision,
  tavg double precision,
  tmax double precision,
  lwtime double precision,
  hravg double precision,
	psum double precision,
	rsum double precision,
	wavg double precision,
  CONSTRAINT weather_data_pkey PRIMARY KEY (id_weather_data)
);


CREATE TABLE model
(
  id_model serial NOT NULL,
  model_name character varying,
  low_threshold double precision,
  up_threshold double precision,
  biofix integer,
  CONSTRAINT model_pkey PRIMARY KEY (id_model)
);


CREATE TABLE model_stage
(
  id_model_stage serial NOT NULL,
  id_model integer,
  stage_name character varying,
	low_threshold double precision,
  up_threshold double precision,
  accumulation double precision,
  stage_order integer,
  CONSTRAINT model_stage_pkey PRIMARY KEY (id_model_stage)
);


--------------------------------------------------------------------
-- Added 24.04.2015
--------------------------------------------------------------------

CREATE TABLE weather_data_tmp
(
  id_weather_data_tmp serial NOT NULL,
  id_weather_station integer NOT NULL,
  time_ref timestamp with time zone,
  tmin double precision,
  tavg double precision,
  tmax double precision,
  lwtime double precision,
  hravg double precision,
  psum double precision,
  rsum double precision,
  wavg double precision,
  CONSTRAINT weather_data_tmp_pkey PRIMARY KEY (id_weather_data_tmp)
)
WITH (
  OIDS=FALSE
);


--------------------------------------------------------------------
-- Added 22.06.2015
--------------------------------------------------------------------

CREATE TABLE users
(
  id_user uuid NOT NULL,
  username character varying,
  email text,
  last_login timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id_user)
);

CREATE TABLE users_role
(
  id_user uuid NOT NULL,
  "role" character varying NOT NULL,
  CONSTRAINT users_role_pkey PRIMARY KEY (id_user, role)
);

CREATE TABLE dashboard
(
  id_dashboard serial NOT NULL,
  dashboard_title character varying,
  dashboard_input text,
  uid 	character varying,
  CONSTRAINT dashboard_pkey PRIMARY KEY (id_dashboard)
);


ALTER TABLE dashboard ADD COLUMN dashboard_order integer;

CREATE OR REPLACE FUNCTION _smartipm_update_order()
  RETURNS trigger AS
$BODY$	
DECLARE
	max_val integer;
	old_order integer;
BEGIN
	
	execute 'select max(dashboard_order) from dashboard WHERE uid='''|| NEW.uid ||'''' INTO max_val;
	IF (max_val is null) then
		max_val=0;
	END IF;			
	RAISE INFO 'aaaa %', 	max_val;	
	NEW.dashboard_order=max_val+1;			
		
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE;

CREATE TRIGGER _smartipm_update_order_trigger BEFORE INSERT  ON dashboard FOR EACH ROW EXECUTE PROCEDURE _smartipm_update_order();

