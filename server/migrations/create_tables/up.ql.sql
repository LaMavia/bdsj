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
    @_name varchar(255)!,
    @_city varchar(255)!,
    &ref country_code char(2)!
);

create table? tournament (
    &id,
    @_name varchar(255)!,
    @_year integer!,
    &ref location_id integer!,
    @_stage integer! default 0,
    @_host char(2)! -> country_code,
    @_round_qualifier_id integer -> round_id,
    @_round_first_id integer -> round_id,
    @_round_second_id integer -> round_id
);

create table? lim (
    @_amount integer! default 2,
    &ref country_code char(2)!,
    &ref tournament_id integer!,
    &pk (@_country_code, @_tournament_id)
);

create table? person (
    &id,
    @_firstname varchar(255)!,
    @_lastname varchar(255)!,
    @_gender varchar(2)!,
    @_nationality char(2)! -> country_code
);

create table? participant (
    &id,
    &ref country_code char(2)!,
    &ref tournament_id integer!,
    &ref person_id integer!
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