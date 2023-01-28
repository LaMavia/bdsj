-- pgcrypto polyfill
begin;
create function gen_random_uuid()
    returns uuid
    language sql
    as 'SELECT uuid_in(overlay(overlay(md5(random()::text || '':'' || random()::text) placing ''4'' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring);';
end;

-- Your SQL goes here
begin;

create table? country (
    @_name varchar(255)!,
    @_code char(2)! primary key
);

create table? round (
    &id,
    @_date date! default current_date
);

create table? location (
    &id,
    @_name varchar(255)! check (length(@_name) > 0),
    @_city varchar(255)! check (length(@_city) > 0),
    &ref country_code char(2)!
);

create table? tournament (
    &id,
    @_name varchar(255)! check (length(@_name) > 0),
    @_year integer!,
    &ref location_id integer!,
    @_stage integer default 0!,
    @_host char(2)! -> country_code,
    @_round_qualifier_id integer -> round_id,
    @_round_first_id integer -> round_id,
    @_round_second_id integer -> round_id
);

create table? lim (
    @_amount integer default 2! check (@_amount > 0),
    &ref country_code char(2)!,
    &ref tournament_id integer!,
    &pk (@_country_code, @_tournament_id)
);

create table? person (
    &id,
    @_first_name varchar(255)! check (length(@_first_name) > 0),
    @_last_name varchar(255)! check (length(@_last_name) > 0),
    @_gender varchar(2)! check (@_gender in ('m', 'f', 'nb', 'na', 'gf', 'db', 'dg', 'ag')),
    @_nationality char(2)! -> country_code
);

create table? participant (
    &id,
    &ref country_code char(2)!,
    &ref tournament_id integer!,
    &ref person_id integer!,
    unique (@_tournament_id, @_person_id)
);

create table? position (
    &ref participant_id integer!,
    &ref round_id integer!,
    @_initial integer!,
    @_final integer,
    &pk (@_participant_id, @_round_id)
);

create table? jump (
    &ref participant_id integer!,
    &ref round_id integer!,
    @_score integer!,
    @_distance integer!,
    &pk (@_participant_id, @_round_id)
);

create table? disqualification (
    &ref participant_id integer!,
    &ref round_id integer!,
    @_reason text!,
    &pk (@_participant_id, @_round_id)
);

create table? auth (
    &id,
    @_pass text!
);

create table? sess (
    @_id uuid primary key default gen_random_uuid(),
    @_expires_at timestamp,
    &ref auth_id integer!
);


-- functions --
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
      else return '';
    end case;
  end;
$$ language plpgsql;

-- create or replace function make_jump(
--   in partitipant_id integer,
--   in round_id integer
-- )

create or replace function play_round(
  in in_round_id integer,
  in in_participant_id integer,
  in 
)

create or replace function next_stage(
  in in_tournament_id integer
) returns void as $$
  declare
    current_stage integer;
    participant_count integer;
    new_round_id integer := -1;
  begin
    select tournament_stage into current_stage
      from tournament where tournament_id = in_tournament_id;

    if current_stage > 3 then return; end if;
    select 
      count(participant_person_id) into participant_count
      from participant 
      where participant_tournament_id = in_tournament_id;

    if current_stage < 2 then 
      insert into round(round_id) values (null)
        returning round_id into new_round_id;
    end if;
    -- play the qualifier
    if current_stage = 0 and participant_count >= 50 then 
      -- insert the round
      update tournament 
        set 
          tournament_round_qualifier_id = new_round_id,
          tournament_stage = 1
        where tournament_id = in_tournament_id
        ;
      -- play the round
      select play_round(
        new_round_id, 
        participant_id, 
        row_number() over (order by random())
      ) from participant
        where tournament_id = in_tournament_id;
    -- play the first round
    elsif current_stage <= 1 then
      update tournament 
        set 
          tournament_round_qualifier_id = new_round_id,
          tournament_stage = 2
        where tournament_id = in_tournament_id
        ;
    -- play the second round
    else 
      
    end if;
  end;
$$ language plpgsql;

-- session
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
  in duration interval) returns text as $$
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

-- triggers
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

    if used_tickets >= available_tickets then
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

-- values
insert into auth(auth_pass) values (md5('xxx'));
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

commit;