use async_trait::async_trait;
use http::{header::SET_COOKIE, HeaderMap, HeaderValue};

use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::auth,
    router::{ApiRoute, Method},
};
use std::collections::HashMap;
pub struct AuthRoute {}

#[async_trait]
impl ApiRoute for AuthRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "auth"
    }

    async fn run<'a>(
        &self,
        _method: &'a Method,
        _path: &'a String,
        _headers: &'a http::HeaderMap,
        _cookies: &'a HashMap<String, String>,
        body: &'a String,
    ) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;

        match auth::start_session(&db, body, "1 hour").await {
            Ok(session_key) => {
                let mut res_headers = HeaderMap::new();
                res_headers.insert(
                    SET_COOKIE,
                    HeaderValue::from_str(format!("session_key={}", session_key).as_str()).unwrap(),
                );

                ApiResponse::<String, String>::ok(session_key).send(200, Option::Some(res_headers))
            }
            Err(e) => ApiResponse::<i64, String>::error(e).send(401, None),
        }
    }
}
