-- Your SQL goes here
begin;

create table if not exists country (
    country_id serial primary key,
    country_name varchar(255) not null,
    country_name_short char(2) not null
);

create table if not exists round (
    round_id serial primary key,
    round_date date not null default current_date
);

create table if not exists location (
    location_id serial primary key,
    location_name varchar(255) not null,
    location_city varchar(255) not null
);

create table if not exists tournament (
    tournament_id serial primary key,
    tournament_name varchar(255) not null,
    tournament_year integer not null,
    tournament_location_id integer 
        references location (location_id),
    tournament_host_id integer 
        references country (country_id),
    tournament_round_qualifier integer,
    tournament_round_first_id integer 
        references round (round_id),
    tournament_round_second_id integer 
        references round (round_id)
);

create table if not exists lim (
    lim_id serial primary key,
    lim_amount integer not null default 2,
    lim_country_id integer 
        references country (country_id),
    lim_tournament_id integer 
        references tournament (tournament_id)
);

create table if not exists person (
    person_id serial primary key,
    person_firstname varchar(255) not null,
    person_lastname varchar(255) not null,
    person_gender char(1) not null,
    person_nationality_id integer 
        references country (country_id)
);

create table if not exists participant (
    participant_id serial primary key,
    participant_country_id integer 
        references country (country_id),
    participant_tournament_id integer 
        references tournament (tournament_id)
);

create table if not exists position (
    position_id serial primary key,
    position_participant_id integer 
        references participant (participant_id),
    position_round_id integer 
        references round (round_id),
    position_initial integer not null,
    position_final integer
);

create table if not exists jump (
    jump_id serial primary key,
    jump_participant_id integer 
        references participant (participant_id),
    jump_round_id integer 
        references round (round_id),
    jump_score integer not null,
    jump_distance integer not null
);

create table if not exists disqualification (
    disqualification_id serial primary key,
    disqualification_participant_id integer 
        references participant (participant_id),
    disqualification_round_id integer 
        references round (round_id),
    disqualification_reason text not null
);

commit;