do language plpgsql $$
declare 
  mx integer;
begin
  select max(auth_id) into mx from auth;
  perform setval('auth_auth_id_seq', mx + 1);

  select max(location_id) into mx from location;
  perform setval('location_location_id_seq', mx + 1);

  select max(participant_id) into mx from participant;
  perform setval('participant_participant_id_seq', mx + 1);

  select max(person_id) into mx from person;
  perform setval('person_person_id_seq', mx + 1);

  select max(round_id) into mx from round;
  perform setval('round_round_id_seq', mx + 1);

  select max(tournament_id) into mx from tournament;
  perform setval('tournament_tournament_id_seq', mx + 1);
end;
$$;