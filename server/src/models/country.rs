use crate::schema::country;
use diesel::{Queryable, QueryableByName};
use serde::Serialize;

#[derive(Serialize, Queryable, QueryableByName)]
#[diesel(table_name = country)]
pub struct Country {
    pub country_id: i32,
    pub country_name: String,
    pub country_name_short: String,
}
