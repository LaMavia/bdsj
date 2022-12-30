use serde::Serialize;

#[derive(Serialize)]
pub struct Position {
    pub position_participant_id: i32,
    pub position_round_id: i32,
    pub position_initial: i32,
    pub position_final: Option<i32>,
}
