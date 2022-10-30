use diesel::{Queryable, QueryableByName};

use crate::schema::disqualification;

#[derive(Queryable, QueryableByName)]
#[diesel(table_name = disqualification)]
pub struct Disqualification {
    pub disqualification_id: i32,
    pub disqualification_participant_id: i32,
    pub disqualification_round_id: i32,
    pub disqualification_reason: String,
}
