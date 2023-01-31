create or replace function participant_insert_check() 
returns trigger as $$
  declare 
    available_tickets integer;
    used_tickets      integer;
    current_stage     integer;
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

    select tournament_stage into current_stage
    from tournament
    where tournament_id = NEW.participant_tournament_id
    ;

    raise notice 
      'tournament: %, stage: %, country: %, tickets: %/%', 
      NEW.participant_tournament_id,
      current_stage,
      NEW.participant_country_code,
      used_tickets, 
      available_tickets
    ;

    if current_stage > 0 then 
      raise exception 'Zapisy zostały zamknięte';
    elsif available_tickets is null or used_tickets >= available_tickets then
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
  before insert or update
  on tournament
  for each row
  execute procedure check_tournament_location()
;

create or replace function round_exclusion_jump_check() 
returns trigger as $$
  declare
    e_dis boolean;
  begin
    -- check if disqualification exists
    select exists (
      select * 
      from disqualification 
      where disqualification_participant_id = NEW.jump_participant_id
        and disqualification_round_id       = NEW.jump_round_id
    ) A into e_dis;

    if e_dis then 
      raise exception 'Rekord rundy może zawierać jedynie skok (jump) lub dyskwalifikację (disqualification)';
    end if;

    return NEW;
  end;
$$ language plpgsql;

create trigger round_exclusion_jump_trigger
  before insert 
  on jump 
  for each row
  execute procedure round_exclusion_jump_check()
;



create or replace function round_exclusion_dis_check() 
returns trigger as $$
  declare
    e_jump boolean;
  begin
    -- check if the jump exists
    select exists (
      select * 
      from jump 
      where jump.jump_participant_id = NEW.disqualification_participant_id
        and jump.jump_round_id       = NEW.disqualification_round_id
    ) A into e_jump;

    if e_jump then 
      raise exception 'Rekord rundy może zawierać jedynie skok (jump) lub dyskwalifikację (disqualification)';
    end if;

    return NEW;
  end;
$$ language plpgsql;

create trigger round_exclusion_dis_trigger
  before insert 
  on disqualification 
  for each row
  execute procedure round_exclusion_dis_check()
;

-- create or replace function round_existence_dis_check() 
-- returns trigger as $$
--   declare
--     e_jump boolean;
--   begin
--     -- check if the jump exists
--     select exists (
--       select * 
--       from jump 
--       where jump.jump_participant_id = OLD.disqualification_participant_id
--         and jump.jump_round_id       = OLD.disqualification_round_id
--     ) A into e_jump;

--     if not e_jump then 
--       raise exception 'Rekord musi zawierać skok (jump) lub dyskwalifikację (disqualification)';
--     end if;

--     return NEW;
--   end;
-- $$ language plpgsql;

-- create trigger round_existence_dis_trigger
--   before delete 
--   on disqualification 
--   for each row
--   execute procedure round_existence_dis_check()
-- ;

-- create or replace function round_existence_jump_check() 
-- returns trigger as $$
--   declare
--     e_dis boolean;
--   begin
--     -- check if the jump exists
--     select exists (
--       select * 
--       from disqualification 
--       where disqualification_participant_id = OLD.jump_participant_id
--         and disqualification_round_id       = OLD.jump_round_id
--     ) A into e_dis;

--     if not e_dis then 
--       raise exception 'Rekord musi zawierać skok (jump) lub dyskwalifikację (disqualification)';
--     end if;

--     return NEW;
--   end;
-- $$ language plpgsql;

-- create trigger round_existence_jump_trigger
--   before delete 
--   on jump
--   for each row
--   execute procedure round_existence_jump_check()
-- ;

-- create or replace function pre_round_dependant_delete() 
-- returns void as $$
--   begin
--     alter table jump disable trigger round_existence_jump_trigger;
--     alter table disqualification disable trigger round_exclusion_dis_trigger;
--   end;
-- $$ language plpgsql;

-- create or replace function post_round_dependant_delete() 
-- returns void as $$
--   begin
--     alter table jump enable trigger round_existence_jump_trigger;
--     alter table disqualification enable trigger round_exclusion_dis_trigger;
--   end;
-- $$ language plpgsql;