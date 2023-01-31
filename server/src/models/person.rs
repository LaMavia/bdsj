use serde::Serialize;

#[derive(Serialize, sqlx::FromRow)]
pub struct Person {
    pub person_id: i32,
    pub person_first_name: String,
    pub person_last_name: String,
    pub person_gender: String,
    pub person_nationality: String,
    pub person_points: i32
}
