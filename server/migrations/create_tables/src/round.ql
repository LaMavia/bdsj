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

create or replace function points_of_place(
  in place integer
) returns integer as $$
  begin
    case place 
      when  1 then return 100; 
      when  2 then return  80;  
      when  3 then return  60;  
      when  4 then return  50;  
      when  5 then return  45;  
      when  6 then return  40;  
      when  7 then return  36;  
      when  8 then return  32;  
      when  9 then return  29;  
      when 10 then return  26;  
      when 11 then return  24;  
      when 12 then return  22;  
      when 13 then return  20;  
      when 14 then return  18;  
      when 15 then return  16;  
      when 16 then return  15;
      when 17 then return  14;
      when 18 then return  13;
      when 19 then return  12;
      when 20 then return  11;
      when 21 then return  10;
      when 22 then return   9;
      when 23 then return   8;
      when 24 then return   7;
      when 25 then return   6;
      when 26 then return   5;
      when 27 then return   4;
      when 28 then return   3;
      when 29 then return   2;
      when 30 then return   1;
      else         return   0;
    end case;
  end;
$$ language plpgsql;

create or replace function play_round(
  in in_round_id         integer,
  in in_participant_id   integer
) returns void as $$
  declare 
    dist_min  float := 60.0;
    dist_max  float := 253.5;
    score_max float := 20.0;
    prec      float := 10.0;
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
      (floor(random() * (dist_max - dist_min) * prec) + dist_min) / prec
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

create or replace function get_last_round(
  in in_tournament_id integer
) returns integer as $$
  declare
    last_round_id integer;
    current_stage integer;
  begin
    select 
      tournament_stage into current_stage
      from tournament 
      where tournament_id = in_tournament_id
    ;

    if current_stage = 0 then return 0; end if;

    case current_stage 
      when 1 then 
        select 
          tournament_round_qualifier_id 
          into last_round_id
          from tournament
          where tournament_id = in_tournament_id
        ;
      when 2 then 
        select 
          tournament_round_first_id 
          into last_round_id
          from tournament
          where tournament_id = in_tournament_id
        ;
      when 3 then 
        select 
          tournament_round_second_id 
          into last_round_id
          from tournament
          where tournament_id = in_tournament_id
        ;
      end case;

      return last_round_id;
  end;
$$ language plpgsql;

create or replace function sum_up_round(
  in last_round_id integer
) returns void as $$
  begin
    with positioning as (
      select 
        position_participant_id participant_id,
        position_round_id round_id,
        rank() over (order by 
          score(
            position_participant_id, 
            position_round_id
          )) new_final
      from position 
      where position_round_id = last_round_id
    ) update position 
      set position_final = new_final
      from positioning 
      where position_round_id = round_id
        and position_participant_id = participant_id
    ;
  end;
$$ language plpgsql;

create or replace function initialise_positions(
  in in_tournament_id integer,
  in last_round_id    integer,
  in new_round_id     integer,
  in in_limit         integer
) returns void as $$
  begin
  with
    possible_participants as (
      select position_participant_id participant_id
        from position 
        where position_round_id = last_round_id
      union
      select participant_id
        from participant
        where participant_tournament_id = in_tournament_id 
    ),
    ranked_participant_ids as (
      select
        participant_id, 
        rank() over (
          order by score(
            participant_id, 
            last_round_id
          ) asc
        ) __rank
      from possible_participants
      order by __rank asc
    )  
  insert into position (
    @_participant_id,
    @_round_id,
    @_initial
  ) select 
      participant_id,
      new_round_id,
      row_number() over (order by random())
    from ranked_participant_ids
    where __rank <= in_limit
  ;
  end;
$$ language plpgsql;

create or replace function next_stage(
  in in_tournament_id integer
) returns void as $$
  declare
    current_stage     integer;
    participant_count integer;
    new_round_id      integer := -1;
    last_round_id     integer;
  begin
    select tournament_stage into current_stage
      from tournament where tournament_id = in_tournament_id;

    raise notice 'Current stage: %', current_stage;

    if current_stage > 3 then return; end if;
    select 
      count(participant_person_id) into participant_count
      from participant 
      where participant_tournament_id = in_tournament_id;

    if current_stage < 4 then
      raise notice 'Inserting new round'; 
      insert into round(@_date) values (current_date)
        returning round_id into new_round_id;
    end if;

    -- get the last round
    select get_last_round(in_tournament_id) into last_round_id;

    if current_stage = 0 and participant_count >= 50 then 
    raise notice 'Starting the qualifier round: #participants = %', participant_count ;
    -- play the qualifier
      -- insert the round
      update tournament 
        set 
          tournament_round_qualifier_id = new_round_id,
          tournament_stage = 1
        where tournament_id = in_tournament_id
        ;
      -- play the round
      perform play_round(
        new_round_id, 
        participant_id
      ) from participant
        where participant_tournament_id = in_tournament_id;

      -- set the positions
      raise notice 'Inserting new initial positions';
      insert into position (
        @_participant_id,
        @_round_id,
        @_initial
      ) select 
          participant_id,
          new_round_id,
          row_number() over (order by random())
        from participant
        where participant_tournament_id = in_tournament_id
      ;

    elsif current_stage <= 1 then
    -- play the first round
      -- insert the round
      update tournament 
        set 
          tournament_round_first_id = new_round_id,
          tournament_stage = 2
        where tournament_id = in_tournament_id
        ;

        -- finish the qualifier
        if last_round_id is not null then
          raise notice 'Summing up the qualifier round';
          perform sum_up_round(last_round_id);
        end if;

        raise notice 'Inserting new initial positions';
        perform initialise_positions(
          in_tournament_id,
          last_round_id,
          new_round_id,
          50
        );

        -- play the round
        raise notice 'Starting the first major round';
        perform play_round(
            new_round_id, 
            position_participant_id 
        ) from position 
          where position_round_id = new_round_id
        ;
    elsif current_stage = 2 then
    -- play the second round
      update tournament 
        set 
          tournament_round_second_id = new_round_id,
          tournament_stage = 3
        where tournament_id = in_tournament_id
        ;

      raise notice 'Summing up the first major round';
      perform sum_up_round(last_round_id);

      raise notice 'Inserting new initial positions';
      perform initialise_positions(
        in_tournament_id,
        last_round_id,
        new_round_id,
        30
      );

      raise notice 'Starting the second major round';
      perform play_round(
          new_round_id, 
          position_participant_id 
      ) from position 
        where position_round_id = new_round_id
      ;
    elsif current_stage = 3 then
    -- end the tournament
      update tournament 
        set 
          tournament_round_first_id = new_round_id,
          tournament_stage = 4
        where tournament_id = in_tournament_id
        ;
      
      raise notice 'Summing up the second major round %', last_round_id;
      perform sum_up_round(last_round_id);

      raise notice 'Assigning worldcup points';
      with points as (
        select 
          position_participant_id score_participant_id,
          points_of_place(
            position_final
          ) score_points
        from position
        inner join participant 
          on ( 
            participant_id = position_participant_id
          )
        where position_round_id = last_round_id
          -- and participant_tournament_id = in_tournament_id
      ) update person
        set person_points = person_points + score_points
        from points
        where score_participant_id = person_id  
      ;
    end if;
  end;
$$ language plpgsql;