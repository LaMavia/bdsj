use serde::Serialize;

// create table? location (
//     &id,
//     @_name varchar(255)!,
//     @_city varchar(255)!,
//     &ref country_code char(2)!
// );
#[derive(Serialize, sqlx::FromRow)]
pub struct Location {
    pub location_id: i32,
    pub location_name: String,
    pub location_city: String,
    pub location_country_code: String,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct LocationInfo {
    pub location_id: i32,
    pub location_name: String,
    pub location_city: String,
    pub location_country_code: String,
    pub location_country_name: String,
}
