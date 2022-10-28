begin;

alter table if exists country owner to bdsj_usr;
alter table if exists round owner to bdsj_usr;
alter table if exists location owner to bdsj_usr;
alter table if exists tournament owner to bdsj_usr;
alter table if exists lim owner to bdsj_usr;
alter table if exists person owner to bdsj_usr;
alter table if exists participant owner to bdsj_usr;
alter table if exists position owner to bdsj_usr;
alter table if exists jump owner to bdsj_usr;
alter table if exists disqualification owner to bdsj_usr;

commit;