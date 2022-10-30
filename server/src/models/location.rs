use crate::schema::location;
use diesel::{Queryable, QueryableByName};

#[derive(Queryable, QueryableByName)]
#[diesel(table_name = location)]
pub struct Location {
    pub location_id: i32,
    pub location_name: String,
    pub location_city: String,
    pub location_country_id: i32,
}
