use std::env;

use sqlx::{PgPool, postgres::PgPoolOptions};

pub struct Database {
    pub connection: PgPool,
}

impl Database {
    pub async fn connect() -> Result<Self, String> {
        match env::var("DATABASE_URL") {
            Ok(database_url) => PgPoolOptions::new().max_connections(5).connect(&database_url).await
                .map(|connection| Self { connection })
                .map_err(|err| format!("[Database::connect/establish] {}", err.to_string())),
            Err(err) => Err(format!("[Database::connect] {}", err.to_string())),
        }
    }
}
