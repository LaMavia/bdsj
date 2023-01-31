use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Disqualification {
    pub disqualification_participant_id: i32,
    pub disqualification_round_id: i32,
    pub disqualification_reason: String,
}
