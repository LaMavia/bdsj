use crate::schema::round;
use chrono::NaiveDate;
use diesel::{Queryable, QueryableByName};

#[derive(Queryable, QueryableByName)]
#[diesel(table_name = round)]
pub struct Round {
    pub round_id: i32,
    pub round_date: NaiveDate,
}
