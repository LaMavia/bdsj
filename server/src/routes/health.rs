use std::collections::HashMap;

use http::header::{COOKIE, HOST, SET_COOKIE, ORIGIN, HeaderName};
use http::{HeaderMap, HeaderValue, StatusCode};
use serde::Serialize;

use crate::api_response::ApiResponse;
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
        path: &'a String,
        headers: &'a http::HeaderMap,
        cookies: &'a HashMap<String, String>,
        body: &'a String,
    ) -> Result<cgi::Response, String> {
        let mut res_headers = HeaderMap::new();
        res_headers.insert(
            SET_COOKIE,
            HeaderValue::from_str(
                format!(
                    "session_token={}; Domain={}",
                    path,
                    headers.get(ORIGIN).map(|h| h.to_str().unwrap()).unwrap_or("")
                )
                .as_str(),
            )
            .unwrap(),
        );

        ApiResponse::<_, String>::ok(HealthInfo {
            method: method.to_owned(),
            body: format!(
                "{}+{}",
                body,
                cookies.get("session_token").unwrap_or(&"".to_string())
            )
            .to_owned(),
        })
        .send(StatusCode::IM_A_TEAPOT, Option::Some(res_headers))
    }
}
