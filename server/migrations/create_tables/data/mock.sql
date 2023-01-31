insert into country (
  country_name, 
  country_code
  ) values ('Polska', 'pl'), ('Argentina', 'ar');
insert into location (
  location_id,
  location_name, 
  location_country_code, 
  location_city
  ) values 
    (1, 'Wielka Krokiew', 'pl', 'Zakopane'), 
    (2, 'Obelisco de BA', 'ar', 'Buenos Aires')
;

insert into tournament (
  tournament_id,
  tournament_name,
  tournament_year, 
  tournament_location_id,
  tournament_host
) values 
  (1, 'El Primer Torneo de BA', 2023, 2, 'ar'),
  (2, 'Turniej Trzech Skoczni', 2023, 1, 'pl')
;

insert into person (
  person_first_name,
  person_last_name,
  person_gender,
  person_nationality
) values ('Avye','Snyder','m','pl'), ('Gil','Reynolds','m','pl'), ('Bertha','Lara','f','ar'), ('Neil','Petty','f','ar'), ('Axel','Brooks','nb','pl'), ('Lionel','Cain','nb','pl'), ('Alexis','Bonner','m','ar'), ('Yardley','Meyer','m','ar'), ('Salvador','Webster','f','pl'), ('Emily','Hernandez','f','pl'), ('Dexter','Walton','nb','ar'), ('Whoopi','Mccoy','nb','ar'), ('Candace','Ross','m','pl'), ('Oscar','Hood','m','pl'), ('Jordan','Stuart','f','ar'), ('Frances','Benson','f','ar'), ('Drew','Santana','nb','pl'), ('Madeline','Burch','nb','pl'), ('Hop','Bullock','m','ar'), ('Moses','Weiss','m','ar'), ('Dean','Dawson','f','pl'), ('Kenneth','Hamilton','f','pl'), ('Grace','Crawford','nb','ar'), ('Garrett','Finch','nb','ar'), ('Shellie','Parks','m','pl'), ('Harlan','Blackwell','m','pl'), ('Melodie','Whitley','f','ar'), ('Merritt','King','f','ar'), ('Noelani','Wade','nb','pl'), ('Patience','Alvarez','nb','pl'), ('Vivien','England','m','ar'), ('Gray','Cantu','m','ar'), ('Zachary','Andrews','f','pl'), ('Wynter','Velazquez','f','pl'), ('Christopher','Henson','nb','ar'), ('Rooney','Delacruz','nb','ar'), ('Vielka','Sampson','m','pl'), ('Helen','Daniels','m','pl'), ('Lance','Mcclure','f','ar'), ('Lyle','Fry','f','ar'), ('Amir','Drake','nb','pl'), ('Camille','Clayton','nb','pl'), ('Dalton','Meyer','m','ar'), ('Burton','Sharpe','m','ar'), ('Leo','Tate','f','pl'), ('Colin','Travis','f','pl'), ('Channing','Jimenez','nb','ar'), ('Christine','Figueroa','nb','ar'), ('Laurel','Whitaker','m','pl'), ('Henry','Wallace','m','pl'), ('Aidan','Hodges','f','ar'), ('Margaret','Meadows','f','ar'), ('Germane','Kim','nb','pl'), ('Xanthus','Dalton','nb','pl'), ('Hamilton','Oconnor','m','ar'), ('Kelly','Johns','m','ar'), ('Honorato','Howard','f','pl'), ('Kylan','Palmer','f','pl'), ('Sheila','Bradley','nb','ar'), ('Rooney','Foster','nb','ar'), ('Maryam','Ingram','m','pl'), ('Gretchen','Mckinney','m','pl'), ('Elliott','Graham','f','ar'), ('Tashya','Holland','f','ar'), ('Riley','Phillips','nb','pl'), ('Buckminster','Holden','nb','pl'), ('Ila','Campos','m','ar'), ('Cain','Evans','m','ar'), ('Nehru','Dudley','f','pl'), ('Chancellor','Ballard','f','pl'), ('Rachel','Mcgee','nb','ar'), ('Shelly','Brooks','nb','ar'), ('Demetria','Rosario','m','pl'), ('Violet','Barr','m','pl'), ('Xena','Barron','f','ar'), ('Daniel','Cox','f','ar'), ('Kennan','Carter','nb','pl'), ('Cameron','Adkins','nb','pl'), ('Chancellor','Young','m','ar'), ('Barry','Shepherd','m','ar'), ('Kasimir','Mcintyre','f','pl'), ('Dana','Howe','f','pl'), ('Celeste','Merritt','nb','ar'), ('Chancellor','Bolton','nb','ar'), ('Jolene','Glover','m','pl'), ('Brock','Buckner','m','pl'), ('Adrian','Summers','f','ar'), ('Madonna','Mendoza','f','ar'), ('Quemby','Singleton','nb','pl'), ('Blaze','Riley','nb','pl'), ('Sophia','Molina','m','ar'), ('Mohammad','Horne','m','ar'), ('Vivien','Nicholson','f','pl'), ('Honorato','Cotton','f','pl'), ('Brenna','Sweet','nb','ar'), ('Maxwell','Coleman','nb','ar'), ('Steven','Shepherd','m','pl'), ('Sylvia','Hays','m','pl'), ('Dustin','Sweeney','f','ar'), ('Willa','Trevino','f','ar'), ('Ignatius','Garrison','nb','pl'), ('Dennis','Ashley','nb','pl'), ('Lillith','Bowers','m','ar'), ('Freya','Haynes','m','ar'), ('Ila','George','f','pl'), ('Michelle','Page','f','pl'), ('Bradley','Perez','nb','ar'), ('Quinn','Hendricks','nb','ar'), ('Alexis','Yates','m','pl'), ('Tanek','Schmidt','m','pl'), ('Allistair','Lott','f','ar'), ('Orson','Chang','f','ar'), ('Neve','Madden','nb','pl'), ('Quynn','England','nb','pl'), ('Karen','Mcfarland','m','ar'), ('Priscilla','Fitzpatrick','m','ar'), ('Aphrodite','Ballard','f','pl'), ('Melyssa','Kirby','f','pl'), ('Wyatt','Galloway','nb','ar'), ('Wanda','Simmons','nb','ar'), ('Rose','Carpenter','m','pl'), ('Cyrus','Tillman','m','pl'), ('Rina','Olsen','f','ar'), ('Donovan','Ball','f','ar'), ('Perry','Shelton','nb','pl'), ('Ross','Moreno','nb','pl'), ('Finn','Golden','m','ar'), ('Gillian','Orr','m','ar'), ('Brett','Wilkinson','f','pl'), ('Orlando','Lane','f','pl'), ('Wallace','Kennedy','nb','ar'), ('Tobias','Pratt','nb','ar'), ('Gavin','Cobb','m','pl'), ('Pandora','Charles','m','pl'), ('Aretha','Bishop','f','ar'), ('Uma','Mcneil','f','ar'), ('Rhoda','Noel','nb','pl'), ('Aquila','Aguilar','nb','pl'), ('Patience','Sheppard','m','ar'), ('Indigo','Buckner','m','ar'), ('Jorden','Nicholson','f','pl'), ('Deanna','Sandoval','f','pl'), ('Jack','Hebert','nb','ar'), ('Timothy','Bush','nb','ar'), ('Dominic','Blevins','m','pl'), ('Thomas','Hodge','m','pl'), ('Maris','Harrington','f','ar'), ('Mechelle','Curtis','f','ar'), ('Doris','Sutton','nb','pl'), ('Lara','Branch','nb','pl'), ('Harlan','Nelson','m','ar'), ('Dennis','Pate','m','ar'), ('Alfonso','Mcgowan','f','pl'), ('Wylie','Mccall','f','pl'), ('Louis','Michael','nb','ar'), ('Chaney','Washington','nb','ar'), ('Hilel','Dunlap','m','pl'), ('Tamekah','Adams','m','pl'), ('Cameron','Hansen','f','ar'), ('Dora','Vinson','f','ar'), ('Juliet','Mendez','nb','pl'), ('Lani','Guzman','nb','pl'), ('Nigel','Banks','m','ar'), ('Kylan','Herman','m','ar'), ('Lacy','Bell','f','pl'), ('Carly','Horton','f','pl'), ('Rose','Hicks','nb','ar'), ('Jakeem','Preston','nb','ar'), ('Barrett','Sims','m','pl'), ('Heidi','Morrison','m','pl'), ('Lacey','Bryan','f','ar'), ('Alyssa','Dorsey','f','ar'), ('Kaseem','Gonzalez','nb','pl'), ('Nathaniel','Rios','nb','pl'), ('August','Hancock','m','ar'), ('Emerson','Chase','m','ar'), ('Rashad','Ellis','f','pl'), ('Kane','Lewis','f','pl'), ('Pamela','Hess','nb','ar'), ('Miriam','Bullock','nb','ar'), ('Kyra','Garner','m','pl'), ('Demetria','Curry','m','pl'), ('Nichole','Everett','f','ar'), ('Victor','Warner','f','ar'), ('Darrel','Mitchell','nb','pl'), ('Vance','Webster','nb','pl'), ('Scott','Pitts','m','ar'), ('Eliana','Fields','m','ar'), ('Hadley','Bonner','f','pl'), ('Christian','Yang','f','pl'), ('Cherokee','Raymond','nb','ar'), ('Kermit','Garrison','nb','ar'), ('Eliana','Rosario','m','pl'), ('Denton','Avery','m','pl'), ('Adrian','Jones','f','ar'), ('Quintessa','Peterson','f','ar'), ('Thane','Nielsen','nb','pl'), ('Lucius','Mitchell','nb','pl'), ('Keaton','Kennedy','m','ar'), ('Jena','Duffy','m','ar')
;

insert into lim (
  lim_amount,
  lim_country_code,
  lim_tournament_id
) values 
  (50, 'pl', 1),
  (50, 'ar', 1),
  (80, 'pl', 2),
  (80, 'ar', 2)
;

insert into participant (
  participant_country_code,
  participant_tournament_id,
  participant_person_id
) select 
    person_nationality,
    1,
    person_id
  from person
  order by random()
  limit 40
;

insert into participant (
  participant_country_code,
  participant_tournament_id,
  participant_person_id
) select 
    person_nationality,
    2,
    person_id
  from person
  order by random()
  limit 70
;