use diesel::{Queryable, QueryableByName};

use crate::schema::jump;

#[derive(Queryable, QueryableByName)]
#[diesel(table_name = jump)]
pub struct Jump {
    pub jump_id: i32,
    pub jump_participant_id: i32,
    pub jump_round_id: i32,
    pub jump_score: i32,
    pub jump_distance: i32,
}
