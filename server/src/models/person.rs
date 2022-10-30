use diesel::{Queryable, QueryableByName};

use crate::schema::person;

#[derive(Queryable, QueryableByName)]
#[diesel(table_name = person)]
pub struct Person {
    pub person_id: i32,
    pub person_firstname: String,
    pub person_lastname: String,
    pub person_gender: String,
    pub person_nationality_id: i32,
}
