-- This file should undo anything in `up.sql`
begin;

drop table if exists country cascade;
drop table if exists round cascade;
drop table if exists location cascade;
drop table if exists tournament cascade;
drop table if exists lim cascade;
drop table if exists person cascade;
drop table if exists participant cascade;
drop table if exists position cascade;
drop table if exists jump cascade;
drop table if exists disqualification cascade;
drop table if exists auth cascade;
drop table if exists sess cascade;

drop trigger if exists participant_insert_check_trigger 
  on participant 
  cascade;

drop trigger if exists check_tournament_location_trigger
  on tournament 
  cascade;

drop trigger if exists round_exclusion_jump_trigger
  on jump 
  cascade;
drop trigger if exists round_exclusion_dis_trigger
  on disqualification 
  cascade;

drop trigger if exists round_closed_jump_trigger
  on jump
  cascade
;
drop trigger if exists round_closed_dis_trigger
  on disqualification
  cascade
;

commit;