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
    @_score float!,
    @_distance float!,
    &pk (@_participant_id, @_round_id)
);

create table? disqualification (
    &ref participant_id integer!,
    &ref round_id integer!,
    @_reason text!,
    &pk (@_participant_id, @_round_id)
);
