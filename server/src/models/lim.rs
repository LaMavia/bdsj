use crate::schema::lim;
use diesel::{Queryable, QueryableByName};

#[derive(Queryable, QueryableByName)]
#[diesel(table_name = lim)]
pub struct Lim {
    pub lim_id: i32,
    pub lim_amount: i32,
    pub lim_country_id: i32,
    pub lim_tournament_id: i32,
}
