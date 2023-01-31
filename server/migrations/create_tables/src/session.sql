create table if not exists auth (
    auth_id serial primary key,
    auth_pass text not null
);

create table if not exists sess (
    sess_id uuid primary key default gen_random_uuid(),
    sess_expires_at timestamp,
    sess_auth_id integer not null 
        references auth (auth_id)
        on delete cascade
);

create or replace function authenticate(in session_id text, in duration interval) 
  returns void as $$
  declare 
    found_count integer := 0;
  begin
    delete from sess 
    where sess_expires_at < current_date;
    
    update sess set sess_expires_at = current_date + duration
    where sess_id::text = session_id;

    get diagnostics found_count = ROW_COUNT;
    if found_count = 0 then
      raise exception 'INVALID SESSION ID: %', session_id;
    end if;
  end
$$ language plpgsql;

create or replace function start_session(
  in pass text, 
  in duration interval
  ) returns text as $$
  declare 
    session_id uuid;
  begin
    with insert_result as (
      insert into sess (sess_auth_id, sess_expires_at) 
      select auth_id, current_date + duration from auth 
      where md5(pass :: bytea) = auth_pass
      limit 1
      returning sess_id
    )
    select sess_id into session_id 
    from insert_result;

    if session_id is null then
      raise exception 'INVALID PASSWORD';
    end if;  

    return session_id :: text;
  end;
$$ language plpgsql;
