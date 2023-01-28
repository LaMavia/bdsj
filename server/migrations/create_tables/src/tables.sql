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
        references country (country_code)
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
