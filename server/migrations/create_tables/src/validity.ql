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
  execute procedure check_tournament_location();
