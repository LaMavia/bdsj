use diesel::dsl::sql_query;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use diesel::query_builder::SqlQuery;
use std::env;

pub struct Database {
    connection: PgConnection,
}

impl Database {
    pub fn connect() -> Result<Self, String> {
        match env::var("DATABASE_URL") {
            Ok(database_url) => PgConnection::establish(&database_url)
                .map(|connection| Self { connection })
                .map_err(|err| format!("[Database::connect/establish] {}", err.to_string())),
            Err(err) => Err(format!("[Database::connect] {}", err.to_string())),
        }
    }

    pub fn query<T: Into<String>>(&self, query: T) -> SqlQuery {
        sql_query(query)
    }

    pub fn load<
        U: diesel::deserialize::FromSqlRow<diesel::sql_types::Untyped, diesel::pg::Pg> + 'static,
    >(
        &mut self,
        query: SqlQuery,
    ) -> Result<Vec<U>, String> {
        query.load(&mut self.connection).map_err(|e| e.to_string())
    }

    pub fn get_result<
        U: diesel::deserialize::FromSqlRow<diesel::sql_types::Untyped, diesel::pg::Pg>,
    >(
        &mut self,
        query: SqlQuery,
    ) -> Result<U, String> {
        query
            .get_result(&mut self.connection)
            .map_err(|e| e.to_string())
    }
}
