use crate::{
    api_response::ApiResponse,
    router::{ApiRoute, Method},
};
use async_trait::async_trait;
use serde::Serialize;
use std::collections::HashMap;

#[derive(Serialize)]
struct NotFoundInfo {
    path: String,
    method: Method,
    body: String,
}

#[allow(dead_code)]
pub struct NotFoundRoute {}

#[async_trait]
impl ApiRoute for NotFoundRoute {
    fn test_route(&self, _method: &crate::router::Method, _path: &String) -> bool {
        true
    }

    async fn run<'a>(
        &self,
        method: &'a Method,
        path: &'a String,
        _headers: &'a http::HeaderMap,
        _cookies: &'a HashMap<String, String>,
        _body: &'a String,
    ) -> Result<cgi::Response, String> {
        ApiResponse::<String, _>::error(format!("Couldn't find path {} [{}]", path, method))
            .send(404, None)
    }
}
