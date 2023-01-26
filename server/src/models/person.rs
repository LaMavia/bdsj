use serde::Serialize;

#[derive(Serialize, sqlx::FromRow)]
pub struct Person {
    pub person_id: i32,
    pub person_firstname: String,
    pub person_lastname: String,
    pub person_gender: String,
    pub person_nationality: String,
}
