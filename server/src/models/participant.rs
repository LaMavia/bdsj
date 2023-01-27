use serde::Serialize;

#[derive(Serialize, sqlx::FromRow)]
pub struct Participant {
    pub participant_id: i32,
    pub participant_country_code: i32,
    pub participant_tournament_id: i32,
    pub participant_person_id: i32
}
