use http::StatusCode;
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
        _path: &'a String,
        _headers: &'a http::HeaderMap,
        body: &'a String,
    ) -> Result<cgi::Response, String> {
        ApiResponse::<_, String>::ok(HealthInfo {
            method: method.to_owned(),
            body: body.to_owned(),
        }).send(StatusCode::IM_A_TEAPOT, None)
    }
}
