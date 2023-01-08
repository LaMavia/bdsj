use serde::Serialize;
use sqlx::FromRow;

// create table? country (
//     @_name varchar(255)!,
//     @_code char(2)! primary key
// );
#[derive(Serialize, FromRow)]
pub struct Country {
    pub country_name: String,
    pub country_code: String,
}
