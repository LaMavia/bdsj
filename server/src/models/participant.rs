use diesel::{Queryable, QueryableByName};

use crate::schema::participant;

#[derive(Queryable, QueryableByName)]
#[diesel(table_name = participant)]
pub struct Participant {
    pub participant_id: i32,
    pub participant_country_id: i32,
    pub participant_tournament_id: i32
}