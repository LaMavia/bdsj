use serde::Serialize;

#[derive(Serialize, sqlx::FromRow)]
pub struct Round {
    pub round_id: i32,
    pub round_date: chrono::NaiveDate,
}
