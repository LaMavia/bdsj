use chrono::serde::ts_seconds;
use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Serialize)]
pub struct Round {
    pub round_id: i32,
    #[serde(with = "ts_seconds")]
    pub round_date: DateTime<Utc>,
}
