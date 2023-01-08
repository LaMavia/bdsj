use serde::Serialize;
use sqlx::FromRow;

// create table? tournament (
//     &id,
//     @_name varchar(255)!,
//     @_year integer!,
//     &ref location_id integer!,
//     @_stage integer!,
//     @_host char(2)! -> country_code,
//     @_round_qualifier_id integer,
//     @_round_first_id integer! -> round_id,
//     @_round_second_id integer! -> round_id
// );

#[derive(Serialize, FromRow)]
pub struct Tournament {
    pub tournament_id: i32,
    pub tournament_name: String,
    pub tournament_year: i32,
    pub tournament_location_id: i32,
    pub tournament_stage: i32,
    pub tournament_host: String,
    pub tournament_round_qualifier_id: Option<i32>,
    pub tournament_round_first_id: i32,
    pub tournament_round_second_id: i32,
}
