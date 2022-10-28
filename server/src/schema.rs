// @generated automatically by Diesel CLI.

diesel::table! {
    country (country_id) {
        country_id -> Int4,
        country_name -> Varchar,
        country_name_short -> Bpchar,
    }
}

diesel::table! {
    disqualification (disqualification_id) {
        disqualification_id -> Int4,
        disqualification_participant_id -> Nullable<Int4>,
        disqualification_round_id -> Nullable<Int4>,
        disqualification_reason -> Text,
    }
}

diesel::table! {
    jump (jump_id) {
        jump_id -> Int4,
        jump_participant_id -> Nullable<Int4>,
        jump_round_id -> Nullable<Int4>,
        jump_score -> Int4,
        jump_distance -> Int4,
    }
}

diesel::table! {
    lim (lim_id) {
        lim_id -> Int4,
        lim_amount -> Int4,
        lim_country_id -> Nullable<Int4>,
        lim_tournament_id -> Nullable<Int4>,
    }
}

diesel::table! {
    location (location_id) {
        location_id -> Int4,
        location_name -> Varchar,
        location_city -> Varchar,
    }
}

diesel::table! {
    participant (participant_id) {
        participant_id -> Int4,
        participant_country_id -> Nullable<Int4>,
        participant_tournament_id -> Nullable<Int4>,
    }
}

diesel::table! {
    person (person_id) {
        person_id -> Int4,
        person_firstname -> Varchar,
        person_lastname -> Varchar,
        person_gender -> Bpchar,
        person_nationality_id -> Nullable<Int4>,
    }
}

diesel::table! {
    position (position_id) {
        position_id -> Int4,
        position_participant_id -> Nullable<Int4>,
        position_round_id -> Nullable<Int4>,
        position_initial -> Int4,
        position_final -> Nullable<Int4>,
    }
}

diesel::table! {
    round (round_id) {
        round_id -> Int4,
        round_date -> Date,
    }
}

diesel::table! {
    tournament (tournament_id) {
        tournament_id -> Int4,
        tournament_name -> Varchar,
        tournament_year -> Int4,
        tournament_location_id -> Nullable<Int4>,
        tournament_host_id -> Nullable<Int4>,
        tournament_round_qualifier -> Nullable<Int4>,
        tournament_round_first_id -> Nullable<Int4>,
        tournament_round_second_id -> Nullable<Int4>,
    }
}

diesel::joinable!(disqualification -> participant (disqualification_participant_id));
diesel::joinable!(disqualification -> round (disqualification_round_id));
diesel::joinable!(jump -> participant (jump_participant_id));
diesel::joinable!(jump -> round (jump_round_id));
diesel::joinable!(lim -> country (lim_country_id));
diesel::joinable!(lim -> tournament (lim_tournament_id));
diesel::joinable!(participant -> country (participant_country_id));
diesel::joinable!(participant -> tournament (participant_tournament_id));
diesel::joinable!(person -> country (person_nationality_id));
diesel::joinable!(position -> participant (position_participant_id));
diesel::joinable!(position -> round (position_round_id));
diesel::joinable!(tournament -> country (tournament_host_id));
diesel::joinable!(tournament -> location (tournament_location_id));

diesel::allow_tables_to_appear_in_same_query!(
    country,
    disqualification,
    jump,
    lim,
    location,
    participant,
    person,
    position,
    round,
    tournament,
);
