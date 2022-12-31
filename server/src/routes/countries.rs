use crate::api_response::ApiResponse;
use crate::database::Database;
use crate::router::{ApiRoute, Method};
use async_trait::async_trait;
use std::collections::HashMap;

pub struct CountriesRoute {}

#[async_trait]
impl ApiRoute for CountriesRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::GET && path == "countries"
    }

    async fn run<'a>(
        &self,
        _method: &'a Method,
        _path: &'a String,
        _headers: &'a http::HeaderMap,
        _cookies: &'a HashMap<String, String>,
        _body: &'a String,
    ) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;
        let countries = sqlx::query!("select count(*) from country;")
            .fetch_all(&db.connection)
            .await
            .map_err(|e| e.to_string())?;

        ApiResponse::<_, String>::ok(countries.get(0).unwrap().count).send(200, None)
    }
}
