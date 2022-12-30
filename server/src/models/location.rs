use serde::Serialize;

#[derive(Serialize)]
pub struct Location {
    pub location_id: i32,
    pub location_name: String,
    pub location_city: String,
    pub location_country_id: i32,
}
