use serde::Serialize;

#[derive(Serialize)]
pub struct Country {
    pub country_id: i32,
    pub country_name: String,
    pub country_name_short: String,
}
