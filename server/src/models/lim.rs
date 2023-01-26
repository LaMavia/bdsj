use serde::Serialize;

#[derive(Serialize, sqlx::FromRow)]
pub struct Lim {
    pub lim_amount: i64,
    pub lim_country_code: String,
    pub lim_tournament_id: i32,
}
