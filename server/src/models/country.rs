use serde::Serialize;
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct Country {
    pub country_name: String,
    pub country_code: String,
}

#[derive(Serialize, FromRow)]
pub struct CountryEntryInfo {
    pub country_code: String,
    pub country_name: String,
    pub country_tournaments: i32,
    pub country_participants: i32,
}

#[derive(Serialize, FromRow)]
pub struct CountryDescInfo {
    pub country_code: String,
    pub country_name: String,
    pub country_tournaments: i32,
    pub country_participants: i32,
    pub country_nationals: i32,
    pub country_points: i32,
}
