use serde::Serialize;

#[derive(Serialize)]
pub struct Jump {
    pub jump_participant_id: i32,
    pub jump_round_id: i32,
    pub jump_score: i32,
    pub jump_distance: i32,
}
