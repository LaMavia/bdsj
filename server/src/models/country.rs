use crate::schema::country;
use diesel::{Queryable, QueryableByName};

#[derive(Queryable, QueryableByName)]
#[diesel(table_name = country)]
pub struct Country {
    pub country_id: i32,
    pub country_name: String,
    pub country_name_short: String,
}
