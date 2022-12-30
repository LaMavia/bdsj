use serde::Serialize;

#[derive(Serialize)]
pub struct Tournament {
    pub tournament_id: i32,
    pub tournament_name: String,
    pub tournament_location_id: i32,
    pub tournament_host_id: i32,
    pub tournament_round_qualifier_id: Option<i32>,
    pub tournament_round_first_id: i32,
    pub tournament_round_second_id: i32,
}
