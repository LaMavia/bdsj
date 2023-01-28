create or replace function stage_name(
  in stage integer
) returns text as $$
  declare 
    name text;
  begin
    case stage
      when 0 then name := 'Zapisy' ;
      when 1 then name := 'Kwalifikacje';
      when 2 then name := 'Pierwsza seria';
      when 3 then name := 'Druga seria';
      else        name := 'Zakończone';
    end case;
    return name;
  end;
$$ language plpgsql;

create or replace function gen_dysqualification_reason()
returns text as $$
  begin
    case floor(random() * 2) 
      when 0 then return 'Zły strój';
      when 1 then return 'Braki techniczne';
      else        return '';
    end case;
  end;
$$ language plpgsql;

create or replace function score(
  in in_participant_id integer,
  in in_round_id integer
) returns float as $$
  declare
    score float := 0;
  begin
    select jump_score + jump_distance into score
      from jump
      where jump_participant_id = in_participant_id
        and jump_round_id = in_round_id
    ;

    return score;
  end;
$$ language plpgsql;


create or replace function play_round(
  in in_round_id         integer,
  in in_participant_id   integer
) returns void as $$
  declare 
    dist_min float := 60.0;
    dist_max float := 253.5;
    score_max float := 20.0;
    prec float := 10.0;
  begin
    if random() > 0.2 then
    -- jump
    insert into jump (
      @_participant_id,
      @_round_id,
      @_score,
      @_distance
    ) values (
      in_participant_id,
      in_round_id,
      floor(random() * score_max * prec) / prec,
      floor(random() * (dist_max - dist_min) * prec) + dist_min / prec
    );

    else
    -- disqualify
    insert into disqualification (
      @_participant_id,
      @_round_id,
      @_reason
    ) values (
      in_participant_id,
      in_round_id,
      gen_dysqualification_reason()
    );

    end if;
  end;
$$ language plpgsql;

create or replace function next_stage(
  in in_tournament_id integer
) returns void as $$
  declare
    current_stage integer;
    participant_count integer;
    new_round_id integer := -1;
  begin
    select tournament_stage into current_stage
      from tournament where tournament_id = in_tournament_id;

    if current_stage > 3 then return; end if;
    select 
      count(participant_person_id) into participant_count
      from participant 
      where participant_tournament_id = in_tournament_id;

    if current_stage < 2 then 
      insert into round(round_id) values (null)
        returning round_id into new_round_id;
    end if;

    if current_stage = 0 and participant_count >= 50 then 
    -- play the qualifier
      -- insert the round
      update tournament 
        set 
          tournament_round_qualifier_id = new_round_id,
          tournament_stage = 1
        where tournament_id = in_tournament_id
        ;
      -- play the round
      select play_round(
        new_round_id, 
        participant_id
      ) from participant
        where tournament_id = in_tournament_id;

      -- set the positions

    elsif current_stage <= 1 then
    -- play the first round
      -- insert the round
      update tournament 
        set 
          tournament_round_first_id = new_round_id,
          tournament_stage = 2
        where tournament_id = in_tournament_id
        ;

      declare
        quantifier_round_id integer;
      begin
        -- get the qualifier round
        select 
          tournament_round_qualifier_id 
          into quantifier_round_id
          where tournament_id = in_tournament_id
        ;

        -- play the round
        with 
          possible_participants as (
            select position_participant_id participant_id
              from position 
              where position_round_id = quantifier_round_id
            union
            select participant_id
              from participant
              where participant_tournament_id = in_tournament_id 
          ), ranked_participant_ids as (
            select
              participant_id, 
              rank() over (
                order by score(
                  participant_id, 
                  quantifier_round_id
                ) asc
              ) __rank
            from possible_participants
        )
        select play_round(
          new_round_id, 
          participant_id 
        ) from ranked_participant_ids
        having rank <= 50
        order by __rank asc;
      end;


    else 
    -- play the second round
      
    end if;
  end;
$$ language plpgsql;