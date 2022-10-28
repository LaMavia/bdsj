-- Your SQL goes here
begin;

create table? country (
    &id,
    @_name varchar(255)!,
    @_name_short char(2)!
);

create table? round (
    &id,
    @_date date! default current_date
);

create table? location (
    &id,
    @_name varchar(255)!,
    @_city varchar(255)!
);

create table? tournament (
    &id,
    @_name varchar(255)!,
    @_year numeric(1, 2)!,
    &ref location_id integer,
    @_host_id integer -> country_id,
    @_round_qualifier integer,
    @_round_first_id integer -> round_id,
    @_round_second_id integer -> round_id
);

create table? lim (
    &id,
    @_amount integer! default 2,
    &ref country_id integer,
    &ref tournament_id integer
);

create table? person (
    &id,
    @_firstname varchar(255)!,
    @_lastname varchar(255)!,
    @_gender char(1)!,
    @_nationality_id integer -> country_id
);

create table? participant (
    &id,
    &ref country_id integer,
    &ref tournament_id integer
);

create table? position (
    &id,
    &ref participant_id integer,
    &ref round_id integer,
    @_initial integer!,
    @_final integer
);

create table? jump (
    &id,
    &ref participant_id integer,
    &ref round_id integer,
    @_score integer!,
    @_distance integer!
);

create table? disqualification (
    &id,
    &ref participant_id integer,
    &ref round_id integer,
    @_reason text!
);

commit;