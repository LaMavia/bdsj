-- pgcrypto polyfill
begin;
create function gen_random_uuid()
    returns uuid
    language sql
    as 'SELECT uuid_in(overlay(overlay(md5(random()::text || '':'' || random()::text) placing ''4'' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring);';
end;

begin;
create table if not exists country (
    country_name varchar(255) not null,
    country_code char(2) not null primary key
);

create table if not exists round (
    round_id serial primary key,
    round_date date not null default current_date
);

create table if not exists location (
    location_id serial primary key,
    location_name varchar(255) not null check (length(location_name) > 0),
    location_city varchar(255) not null check (length(location_city) > 0),
    location_country_code char(2) not null 
        references country (country_code)
);

create table if not exists tournament (
    tournament_id serial primary key,
    tournament_name varchar(255) not null check (length(tournament_name) > 0),
    tournament_year integer not null,
    tournament_location_id integer not null 
        references location (location_id),
    tournament_stage integer default 0 not null,
    tournament_host char(2) not null 
        references country (country_code),
    tournament_round_qualifier_id integer 
        references round (round_id),
    tournament_round_first_id integer 
        references round (round_id),
    tournament_round_second_id integer 
        references round (round_id)
);

create table if not exists lim (
    lim_amount integer default 2 not null check (lim_amount > 0),
    lim_country_code char(2) not null 
        references country (country_code),
    lim_tournament_id integer not null 
        references tournament (tournament_id),
    primary key (lim_country_code, lim_tournament_id)
);

create table if not exists person (
    person_id serial primary key,
    person_first_name varchar(255) not null check (length(person_first_name) > 0),
    person_last_name varchar(255) not null check (length(person_last_name) > 0),
    person_gender varchar(2) not null check (person_gender in ('m', 'f', 'nb', 'na', 'gf', 'db', 'dg', 'ag')),
    person_nationality char(2) not null 
        references country (country_code),
    person_points integer default 0 not null
);

create table if not exists participant (
    participant_id serial primary key,
    participant_country_code char(2) not null 
        references country (country_code),
    participant_tournament_id integer not null 
        references tournament (tournament_id),
    participant_person_id integer not null 
        references person (person_id),
    unique (participant_tournament_id, participant_person_id)
);

create table if not exists position (
    position_participant_id integer not null 
        references participant (participant_id),
    position_round_id integer not null 
        references round (round_id),
    position_initial integer not null,
    position_final integer,
    primary key (position_participant_id, position_round_id)
);

create table if not exists jump (
    jump_participant_id integer not null 
        references participant (participant_id),
    jump_round_id integer not null 
        references round (round_id),
    jump_score float not null,
    jump_distance float not null,
    primary key (jump_participant_id, jump_round_id)
);

create table if not exists disqualification (
    disqualification_participant_id integer not null 
        references participant (participant_id),
    disqualification_round_id integer not null 
        references round (round_id),
    disqualification_reason text not null,
    primary key (disqualification_participant_id, disqualification_round_id)
);

create table if not exists auth (
    auth_id serial primary key,
    auth_pass text not null
);

create table if not exists sess (
    sess_id uuid primary key default gen_random_uuid(),
    sess_expires_at timestamp,
    sess_auth_id integer not null 
        references auth (auth_id)
);

create or replace function authenticate(in session_id text, in duration interval) 
  returns void as $$
  declare 
    found_count integer := 0;
  begin
    delete from sess 
    where sess_expires_at < current_date;
    
    update sess set sess_expires_at = current_date + duration
    where sess_id::text = session_id;

    get diagnostics found_count = ROW_COUNT;
    if found_count = 0 then
      raise exception 'INVALID SESSION ID: %', session_id;
    end if;
  end
$$ language plpgsql;

create or replace function start_session(
  in pass text, 
  in duration interval
  ) returns text as $$
  declare 
    session_id uuid;
  begin
    with insert_result as (
      insert into sess (sess_auth_id, sess_expires_at) 
      select auth_id, current_date + duration from auth 
      where md5(pass :: bytea) = auth_pass
      limit 1
      returning sess_id
    )
    select sess_id into session_id 
    from insert_result;

    if session_id is null then
      raise exception 'INVALID PASSWORD';
    end if;  

    return session_id :: text;
  end;
$$ language plpgsql;

create or replace function stage_name(
  in stage integer
) returns text as $$
  declare 
    name text;
  begin
    case stage
      when 0 then name := 'Zapisy' ;
      when 1 then name := 'Kwalifikacje';
      when 2 then name := 'Pierwsza seria';
      when 3 then name := 'Druga seria';
      else        name := 'Zakończone';
    end case;
    return name;
  end;
$$ language plpgsql;

create or replace function gen_dysqualification_reason()
returns text as $$
  begin
    case floor(random() * 2) 
      when 0 then return 'Zły strój';
      when 1 then return 'Braki techniczne';
      else        return '';
    end case;
  end;
$$ language plpgsql;

create or replace function score(
  in in_participant_id integer,
  in in_round_id integer
) returns float as $$
  declare
    score float := 0;
  begin
    select jump_score + jump_distance into score
      from jump
      where jump_participant_id = in_participant_id
        and jump_round_id = in_round_id
    ;

    return score;
  end;
$$ language plpgsql;

create or replace function points_of_place(
  in place integer
) returns integer as $$
  begin
    case place 
      when  1 then return 100; 
      when  2 then return  80;  
      when  3 then return  60;  
      when  4 then return  50;  
      when  5 then return  45;  
      when  6 then return  40;  
      when  7 then return  36;  
      when  8 then return  32;  
      when  9 then return  29;  
      when 10 then return  26;  
      when 11 then return  24;  
      when 12 then return  22;  
      when 13 then return  20;  
      when 14 then return  18;  
      when 15 then return  16;  
      when 16 then return  15;
      when 17 then return  14;
      when 18 then return  13;
      when 19 then return  12;
      when 20 then return  11;
      when 21 then return  10;
      when 22 then return   9;
      when 23 then return   8;
      when 24 then return   7;
      when 25 then return   6;
      when 26 then return   5;
      when 27 then return   4;
      when 28 then return   3;
      when 29 then return   2;
      when 30 then return   1;
      else         return   0;
    end case;
  end;
$$ language plpgsql;

create or replace function play_round(
  in in_round_id         integer,
  in in_participant_id   integer
) returns void as $$
  declare 
    dist_min  float := 60.0;
    dist_max  float := 253.5;
    score_max float := 20.0;
    prec      float := 10.0;
  begin
    if random() > 0.2 then
    -- jump
    insert into jump (
      jump_participant_id,
      jump_round_id,
      jump_score,
      jump_distance
    ) values (
      in_participant_id,
      in_round_id,
      floor(random() * score_max * prec) / prec,
      (floor(random() * (dist_max - dist_min) * prec) + dist_min) / prec
    );

    else
    -- disqualify
    insert into disqualification (
      disqualification_participant_id,
      disqualification_round_id,
      disqualification_reason
    ) values (
      in_participant_id,
      in_round_id,
      gen_dysqualification_reason()
    );

    end if;
  end;
$$ language plpgsql;

create or replace function get_last_round(
  in in_tournament_id integer
) returns integer as $$
  declare
    last_round_id integer;
    current_stage integer;
  begin
    select 
      tournament_stage into current_stage
      from tournament 
      where tournament_id = in_tournament_id
    ;

    if current_stage = 0 then return 0; end if;

    case current_stage 
      when 1 then 
        select 
          tournament_round_qualifier_id 
          into last_round_id
          from tournament
          where tournament_id = in_tournament_id
        ;
      when 2 then 
        select 
          tournament_round_first_id 
          into last_round_id
          from tournament
          where tournament_id = in_tournament_id
        ;
      when 3 then 
        select 
          tournament_round_second_id 
          into last_round_id
          from tournament
          where tournament_id = in_tournament_id
        ;
      end case;

      return last_round_id;
  end;
$$ language plpgsql;

create or replace function sum_up_round(
  in last_round_id integer
) returns void as $$
  begin
    with positioning as (
      select 
        position_participant_id participant_id,
        position_round_id round_id,
        rank() over (order by 
          score(
            position_participant_id, 
            position_round_id
          )) new_final
      from position 
      where position_round_id = last_round_id
    ) update position 
      set position_final = new_final
      from positioning 
      where position_round_id = round_id
        and position_participant_id = participant_id
    ;
  end;
$$ language plpgsql;

create or replace function initialise_positions(
  in in_tournament_id integer,
  in last_round_id    integer,
  in new_round_id     integer,
  in in_limit         integer
) returns void as $$
  begin
  with
    possible_participants as (
      select position_participant_id participant_id
        from position 
        where position_round_id = last_round_id
      union
      select participant_id
        from participant
        where participant_tournament_id = in_tournament_id 
    ),
    ranked_participant_ids as (
      select
        participant_id, 
        rank() over (
          order by score(
            participant_id, 
            last_round_id
          ) asc
        ) __rank
      from possible_participants
      order by __rank asc
    )  
  insert into position (
    position_participant_id,
    position_round_id,
    position_initial
  ) select 
      participant_id,
      new_round_id,
      row_number() over (order by random())
    from ranked_participant_ids
    where __rank <= in_limit
  ;
  end;
$$ language plpgsql;

create or replace function next_stage(
  in in_tournament_id integer
) returns void as $$
  declare
    current_stage     integer;
    participant_count integer;
    new_round_id      integer := -1;
    last_round_id     integer;
  begin
    select tournament_stage into current_stage
      from tournament where tournament_id = in_tournament_id;

    raise notice 'Current stage: %', current_stage;

    if current_stage > 3 then return; end if;
    select 
      count(participant_person_id) into participant_count
      from participant 
      where participant_tournament_id = in_tournament_id;

    if current_stage < 4 then
      raise notice 'Inserting new round'; 
      insert into round(round_date) values (current_date)
        returning round_id into new_round_id;
    end if;

    -- get the last round
    select get_last_round(in_tournament_id) into last_round_id;

    if current_stage = 0 and participant_count >= 50 then 
    raise notice 'Starting the qualifier round: #participants = %', participant_count ;
    -- play the qualifier
      -- insert the round
      update tournament 
        set 
          tournament_round_qualifier_id = new_round_id,
          tournament_stage = 1
        where tournament_id = in_tournament_id
        ;
      -- play the round
      perform play_round(
        new_round_id, 
        participant_id
      ) from participant
        where participant_tournament_id = in_tournament_id;

      -- set the positions
      raise notice 'Inserting new initial positions';
      insert into position (
        position_participant_id,
        position_round_id,
        position_initial
      ) select 
          participant_id,
          new_round_id,
          row_number() over (order by random())
        from participant
        where participant_tournament_id = in_tournament_id
      ;

    elsif current_stage <= 1 then
    -- play the first round
      -- insert the round
      update tournament 
        set 
          tournament_round_first_id = new_round_id,
          tournament_stage = 2
        where tournament_id = in_tournament_id
        ;

        -- finish the qualifier
        if last_round_id is not null then
          raise notice 'Summing up the qualifier round';
          perform sum_up_round(last_round_id);
        end if;

        raise notice 'Inserting new initial positions';
        perform initialise_positions(
          in_tournament_id,
          last_round_id,
          new_round_id,
          50
        );

        -- play the round
        raise notice 'Starting the first major round';
        perform play_round(
            new_round_id, 
            position_participant_id 
        ) from position 
          where position_round_id = new_round_id
        ;
    elsif current_stage = 2 then
    -- play the second round
      update tournament 
        set 
          tournament_round_second_id = new_round_id,
          tournament_stage = 3
        where tournament_id = in_tournament_id
        ;

      raise notice 'Summing up the first major round';
      perform sum_up_round(last_round_id);

      raise notice 'Inserting new initial positions';
      perform initialise_positions(
        in_tournament_id,
        last_round_id,
        new_round_id,
        30
      );

      raise notice 'Starting the second major round';
      perform play_round(
          new_round_id, 
          position_participant_id 
      ) from position 
        where position_round_id = new_round_id
      ;
    elsif current_stage = 3 then
    -- end the tournament
      update tournament 
        set 
          tournament_round_first_id = new_round_id,
          tournament_stage = 4
        where tournament_id = in_tournament_id
        ;
      
      raise notice 'Summing up the second major round %', last_round_id;
      perform sum_up_round(last_round_id);

      raise notice 'Assigning worldcup points';
      with points as (
        select 
          position_participant_id score_participant_id,
          points_of_place(
            position_final
          ) score_points
        from position
        inner join participant 
          on ( 
            participant_id = position_participant_id
          )
        where position_round_id = last_round_id
          -- and participant_tournament_id = in_tournament_id
      ) update person
        set person_points = person_points + score_points
        from points
        where score_participant_id = person_id  
      ;
    end if;
  end;
$$ language plpgsql;

create or replace function participant_insert_check() 
returns trigger as $$
  declare 
    available_tickets integer;
    used_tickets      integer;
  begin
    select count(*) into used_tickets
    from participant
    where participant_country_code  = NEW.participant_country_code 
      and participant_tournament_id = NEW.participant_tournament_id
    ;

    select lim_amount into available_tickets
    from lim
    where lim_country_code  = NEW.participant_country_code
      and lim_tournament_id = NEW.participant_tournament_id
    ;

    raise notice 
      'tournament: %, country: %, tickets: %/%', 
      NEW.participant_tournament_id,
      NEW.participant_country_code,
      used_tickets, 
      available_tickets
    ;

    if available_tickets is null or used_tickets >= available_tickets then
      raise exception 'Przekroczono kwotę startową';
    end if;

    return NEW;
  end;
$$ language plpgsql;

create trigger participant_insert_check_trigger 
  before insert 
  on participant
  for each row
  execute procedure participant_insert_check();

create or replace function check_tournament_location()
returns trigger as $$
  begin
    if (
      select location_country_code 
      from location 
      where location_id = NEW.tournament_location_id
      ) <> NEW.tournament_host then
      raise exception 'Zawody muszą odbywać się na terenie kraju goszczącego';
    end if;

    return NEW;
  end;
$$ language plpgsql;

create trigger check_tournament_location_trigger
  before insert
  on tournament
  for each row
  execute procedure check_tournament_location();


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
) values
  ('Avye','Snyder','m','pl'),
  ('Gil','Reynolds','m','pl'),
  ('Bertha','Lara','f','ar'),
  ('Neil','Petty','f','ar'),
  ('Axel','Brooks','nb','pl'),
  ('Lionel','Cain','nb','pl'),
  ('Alexis','Bonner','m','ar'),
  ('Yardley','Meyer','m','ar'),
  ('Salvador','Webster','f','pl'),
  ('Emily','Hernandez','f','pl'),
  ('Dexter','Walton','nb','ar'),
  ('Whoopi','Mccoy','nb','ar'),
  ('Candace','Ross','m','pl'),
  ('Oscar','Hood','m','pl'),
  ('Jordan','Stuart','f','ar'),
  ('Frances','Benson','f','ar'),
  ('Drew','Santana','nb','pl'),
  ('Madeline','Burch','nb','pl'),
  ('Hop','Bullock','m','ar'),
  ('Moses','Weiss','m','ar'),
  ('Dean','Dawson','f','pl'),
  ('Kenneth','Hamilton','f','pl'),
  ('Grace','Crawford','nb','ar'),
  ('Garrett','Finch','nb','ar'),
  ('Shellie','Parks','m','pl'),
  ('Harlan','Blackwell','m','pl'),
  ('Melodie','Whitley','f','ar'),
  ('Merritt','King','f','ar'),
  ('Noelani','Wade','nb','pl'),
  ('Patience','Alvarez','nb','pl'),
  ('Vivien','England','m','ar'),
  ('Gray','Cantu','m','ar'),
  ('Zachary','Andrews','f','pl'),
  ('Wynter','Velazquez','f','pl'),
  ('Christopher','Henson','nb','ar'),
  ('Rooney','Delacruz','nb','ar'),
  ('Vielka','Sampson','m','pl'),
  ('Helen','Daniels','m','pl'),
  ('Lance','Mcclure','f','ar'),
  ('Lyle','Fry','f','ar'),
  ('Amir','Drake','nb','pl'),
  ('Camille','Clayton','nb','pl'),
  ('Dalton','Meyer','m','ar'),
  ('Burton','Sharpe','m','ar'),
  ('Leo','Tate','f','pl'),
  ('Colin','Travis','f','pl'),
  ('Channing','Jimenez','nb','ar'),
  ('Christine','Figueroa','nb','ar'),
  ('Laurel','Whitaker','m','pl'),
  ('Henry','Wallace','m','pl'),
  ('Aidan','Hodges','f','ar'),
  ('Margaret','Meadows','f','ar'),
  ('Germane','Kim','nb','pl'),
  ('Xanthus','Dalton','nb','pl'),
  ('Hamilton','Oconnor','m','ar'),
  ('Kelly','Johns','m','ar'),
  ('Honorato','Howard','f','pl'),
  ('Kylan','Palmer','f','pl'),
  ('Sheila','Bradley','nb','ar'),
  ('Rooney','Foster','nb','ar'),
  ('Maryam','Ingram','m','pl'),
  ('Gretchen','Mckinney','m','pl'),
  ('Elliott','Graham','f','ar'),
  ('Tashya','Holland','f','ar'),
  ('Riley','Phillips','nb','pl'),
  ('Buckminster','Holden','nb','pl'),
  ('Ila','Campos','m','ar'),
  ('Cain','Evans','m','ar'),
  ('Nehru','Dudley','f','pl'),
  ('Chancellor','Ballard','f','pl'),
  ('Rachel','Mcgee','nb','ar'),
  ('Shelly','Brooks','nb','ar'),
  ('Demetria','Rosario','m','pl'),
  ('Violet','Barr','m','pl'),
  ('Xena','Barron','f','ar'),
  ('Daniel','Cox','f','ar'),
  ('Kennan','Carter','nb','pl'),
  ('Cameron','Adkins','nb','pl'),
  ('Chancellor','Young','m','ar'),
  ('Barry','Shepherd','m','ar'),
  ('Kasimir','Mcintyre','f','pl'),
  ('Dana','Howe','f','pl'),
  ('Celeste','Merritt','nb','ar'),
  ('Chancellor','Bolton','nb','ar'),
  ('Jolene','Glover','m','pl'),
  ('Brock','Buckner','m','pl'),
  ('Adrian','Summers','f','ar'),
  ('Madonna','Mendoza','f','ar'),
  ('Quemby','Singleton','nb','pl'),
  ('Blaze','Riley','nb','pl'),
  ('Sophia','Molina','m','ar'),
  ('Mohammad','Horne','m','ar'),
  ('Vivien','Nicholson','f','pl'),
  ('Honorato','Cotton','f','pl'),
  ('Brenna','Sweet','nb','ar'),
  ('Maxwell','Coleman','nb','ar'),
  ('Steven','Shepherd','m','pl'),
  ('Sylvia','Hays','m','pl'),
  ('Dustin','Sweeney','f','ar'),
  ('Willa','Trevino','f','ar'),
  ('Ignatius','Garrison','nb','pl'),
  ('Dennis','Ashley','nb','pl'),
  ('Lillith','Bowers','m','ar'),
  ('Freya','Haynes','m','ar'),
  ('Ila','George','f','pl'),
  ('Michelle','Page','f','pl'),
  ('Bradley','Perez','nb','ar'),
  ('Quinn','Hendricks','nb','ar'),
  ('Alexis','Yates','m','pl'),
  ('Tanek','Schmidt','m','pl'),
  ('Allistair','Lott','f','ar'),
  ('Orson','Chang','f','ar'),
  ('Neve','Madden','nb','pl'),
  ('Quynn','England','nb','pl'),
  ('Karen','Mcfarland','m','ar'),
  ('Priscilla','Fitzpatrick','m','ar'),
  ('Aphrodite','Ballard','f','pl'),
  ('Melyssa','Kirby','f','pl'),
  ('Wyatt','Galloway','nb','ar'),
  ('Wanda','Simmons','nb','ar'),
  ('Rose','Carpenter','m','pl'),
  ('Cyrus','Tillman','m','pl'),
  ('Rina','Olsen','f','ar'),
  ('Donovan','Ball','f','ar'),
  ('Perry','Shelton','nb','pl'),
  ('Ross','Moreno','nb','pl'),
  ('Finn','Golden','m','ar'),
  ('Gillian','Orr','m','ar'),
  ('Brett','Wilkinson','f','pl'),
  ('Orlando','Lane','f','pl'),
  ('Wallace','Kennedy','nb','ar'),
  ('Tobias','Pratt','nb','ar'),
  ('Gavin','Cobb','m','pl'),
  ('Pandora','Charles','m','pl'),
  ('Aretha','Bishop','f','ar'),
  ('Uma','Mcneil','f','ar'),
  ('Rhoda','Noel','nb','pl'),
  ('Aquila','Aguilar','nb','pl'),
  ('Patience','Sheppard','m','ar'),
  ('Indigo','Buckner','m','ar'),
  ('Jorden','Nicholson','f','pl'),
  ('Deanna','Sandoval','f','pl'),
  ('Jack','Hebert','nb','ar'),
  ('Timothy','Bush','nb','ar'),
  ('Dominic','Blevins','m','pl'),
  ('Thomas','Hodge','m','pl'),
  ('Maris','Harrington','f','ar'),
  ('Mechelle','Curtis','f','ar'),
  ('Doris','Sutton','nb','pl'),
  ('Lara','Branch','nb','pl'),
  ('Harlan','Nelson','m','ar'),
  ('Dennis','Pate','m','ar'),
  ('Alfonso','Mcgowan','f','pl'),
  ('Wylie','Mccall','f','pl'),
  ('Louis','Michael','nb','ar'),
  ('Chaney','Washington','nb','ar'),
  ('Hilel','Dunlap','m','pl'),
  ('Tamekah','Adams','m','pl'),
  ('Cameron','Hansen','f','ar'),
  ('Dora','Vinson','f','ar'),
  ('Juliet','Mendez','nb','pl'),
  ('Lani','Guzman','nb','pl'),
  ('Nigel','Banks','m','ar'),
  ('Kylan','Herman','m','ar'),
  ('Lacy','Bell','f','pl'),
  ('Carly','Horton','f','pl'),
  ('Rose','Hicks','nb','ar'),
  ('Jakeem','Preston','nb','ar'),
  ('Barrett','Sims','m','pl'),
  ('Heidi','Morrison','m','pl'),
  ('Lacey','Bryan','f','ar'),
  ('Alyssa','Dorsey','f','ar'),
  ('Kaseem','Gonzalez','nb','pl'),
  ('Nathaniel','Rios','nb','pl'),
  ('August','Hancock','m','ar'),
  ('Emerson','Chase','m','ar'),
  ('Rashad','Ellis','f','pl'),
  ('Kane','Lewis','f','pl'),
  ('Pamela','Hess','nb','ar'),
  ('Miriam','Bullock','nb','ar'),
  ('Kyra','Garner','m','pl'),
  ('Demetria','Curry','m','pl'),
  ('Nichole','Everett','f','ar'),
  ('Victor','Warner','f','ar'),
  ('Darrel','Mitchell','nb','pl'),
  ('Vance','Webster','nb','pl'),
  ('Scott','Pitts','m','ar'),
  ('Eliana','Fields','m','ar'),
  ('Hadley','Bonner','f','pl'),
  ('Christian','Yang','f','pl'),
  ('Cherokee','Raymond','nb','ar'),
  ('Kermit','Garrison','nb','ar'),
  ('Eliana','Rosario','m','pl'),
  ('Denton','Avery','m','pl'),
  ('Adrian','Jones','f','ar'),
  ('Quintessa','Peterson','f','ar'),
  ('Thane','Nielsen','nb','pl'),
  ('Lucius','Mitchell','nb','pl'),
  ('Keaton','Kennedy','m','ar'),
  ('Jena','Duffy','m','ar')
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

insert into auth(auth_pass) values (md5('xxx'));
commit;
