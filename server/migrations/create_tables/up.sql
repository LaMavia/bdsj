-- pgcrypto polyfill
begin;
create function gen_random_uuid()
    returns uuid
    language sql
    as 'SELECT uuid_in(overlay(overlay(md5(random()::text || '':'' || random()::text) placing ''4'' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring);';
end;

-- Your SQL goes here
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
    lim_amount integer not null default 2,
    lim_country_code char(2) not null 
        references country (country_code),
    lim_tournament_id integer not null 
        references tournament (tournament_id),
    primary key (lim_country_code, lim_tournament_id)
);

create table if not exists person (
    person_id serial primary key,
    person_firstname varchar(255) not null check (length(person_firstname) > 0),
    person_lastname varchar(255) not null check (length(person_lastname) > 0),
    person_gender varchar(2) not null check (person_gender in ('m', 'f', 'nb', 'na')),
    person_nationality char(2) not null 
        references country (country_code)
);

create table if not exists participant (
    participant_id serial primary key,
    participant_country_code char(2) not null 
        references country (country_code),
    participant_tournament_id integer not null 
        references tournament (tournament_id),
    participant_person_id integer not null 
        references person (person_id)
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
    jump_score integer not null,
    jump_distance integer not null,
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


-- functions --

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

insert into auth(auth_pass) values (md5('xxx'));

commit;