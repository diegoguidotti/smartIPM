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


