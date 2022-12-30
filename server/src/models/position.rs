use diesel::{Queryable, QueryableByName};

use crate::schema::position;

#[derive(Queryable, QueryableByName)]
#[diesel(table_name = position)]
pub struct Position {
    pub position_participant_id: i32,
    pub position_round_id: i32,
    pub position_initial: i32,
    pub position_final: Option<i32>,
}
