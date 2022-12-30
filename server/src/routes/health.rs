use http::StatusCode;
use serde::Serialize;

use crate::api_response::ApiResponse;
use crate::router::{ApiRoute, Method};

#[derive(Serialize, Debug)]
struct HealthInfo {
    method: Method,
    body: String,
}

pub struct HealthRoute {}

impl ApiRoute for HealthRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "health"
    }

    fn run(
        &self,
        method: &Method,
        _path: &String,
        _headers: &http::HeaderMap,
        body: &String,
    ) -> Result<cgi::Response, String> {
        ApiResponse::<_, String>::ok(HealthInfo {
            method: method.to_owned(),
            body: body.to_owned(),
        }).send(StatusCode::IM_A_TEAPOT, None)
    }
}
