insert into country(
  country_name, 
  country_code
  ) values ('Polska', 'pl'), ('Argentina', 'ar');
insert into location(
  location_id,
  location_name, 
  location_country_code, 
  location_city
  ) values 
    (1, 'Wielka Krokiew', 'pl', 'Zakopane'), 
    (2, 'Obelisco de BA', 'ar', 'Buenos Aires')
    ;

insert into tournament(
  tournament_id,
  tournament_name,
  tournament_year, 
  tournament_location_id,
  tournament_host
) values 
  (1, 'El Primer Torneo de BA', 2023, 2, 'ar')
  ;


insert into auth(auth_pass) values (md5('xxx'));