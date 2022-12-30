use serde::Serialize;

#[derive(Serialize)]
pub struct Participant {
    pub participant_id: i32,
    pub participant_country_id: i32,
    pub participant_tournament_id: i32,
}
