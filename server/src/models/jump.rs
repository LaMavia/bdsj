use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Jump {
    pub jump_participant_id: i32,
    pub jump_round_id: i32,
    pub jump_score: f64,
    pub jump_distance: f64,
}
