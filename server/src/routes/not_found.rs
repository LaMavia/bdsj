use serde::Serialize;

use crate::{
    api_response::ApiResponse,
    router::{ApiRoute, Method},
};

#[derive(Serialize)]
struct NotFoundInfo {
    path: String,
    method: Method,
    body: String,
}

#[allow(dead_code)]
pub struct NotFoundRoute {}

impl ApiRoute for NotFoundRoute {
    fn test_route(&self, _method: &crate::router::Method, _path: &String) -> bool {
        true
    }

    fn run(
        &self,
        method: &Method,
        path: &String,
        _headers: &http::HeaderMap,
        _body: &String,
    ) -> Result<cgi::Response, String> {
        ApiResponse::<String, _>::error(format!("Couldn't find path {} [{}]", path, method)).send(404, None)
    }
}
