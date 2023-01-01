use std::collections::HashMap;

use http::header::{HeaderName, COOKIE, HOST, ORIGIN, SET_COOKIE};
use http::{HeaderMap, HeaderValue, StatusCode};
use serde::Serialize;

use crate::api_response::ApiResponse;
use crate::database::Database;
use crate::funcs::auth;
use crate::router::{ApiRoute, Method};
use async_trait::async_trait;

#[derive(Serialize, Debug)]
struct HealthInfo {
    method: Method,
    body: String,
}

pub struct HealthRoute {}

#[async_trait]
impl ApiRoute for HealthRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "health"
    }

    async fn run<'a>(
        &self,
        method: &'a Method,
        _path: &'a String,
        _headers: &'a http::HeaderMap,
        cookies: &'a HashMap<String, String>,
        body: &'a String,
    ) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;
        match auth::auth_session_from_cookies(&db, &cookies, &"1 day".to_string()).await {
            Ok(()) => ApiResponse::<HealthInfo, String>::ok(HealthInfo {
                method: method.to_owned(),
                body: body.to_owned(),
            })
            .send(200, None),
            Err(e_res) => e_res,
        }
    }
}
