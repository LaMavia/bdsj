use diesel::deserialize::FromSqlRow;
use diesel::pg::Pg;
use diesel::sql_types::{Integer, Untyped};
use diesel::{QueryableByName, Queryable};
use serde::Serialize;

#[derive(Serialize, QueryableByName)]
#[diesel()]
pub struct Count {
    #[diesel(sql_type = Integer)]
    pub count: i64,
}

