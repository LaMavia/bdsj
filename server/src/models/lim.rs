use serde::Serialize;

#[derive(Serialize)]
pub struct Lim {
    pub lim_amount: i32,
    pub lim_country_id: i32,
    pub lim_tournament_id: i32,
}
