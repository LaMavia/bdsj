use cgi::string_response;
use http::{header::CONTENT_TYPE, HeaderValue};
use serde::Serialize;

use crate::router::{ApiRoute, Method};

#[derive(Serialize)]
struct NotFoundInfo {
    path: String,
    method: Method,
    body: String,
}

#[allow(dead_code)]
pub struct NotFoundRoute {}

impl NotFoundRoute {
    pub fn new() -> Self {
        NotFoundRoute {}
    }
}

impl ApiRoute for NotFoundRoute {
    fn test_route(&self, _method: &crate::router::Method, _path: &String) -> bool {
        true
    }

    fn run(
        &self,
        method: &Method,
        path: &String,
        _headers: &http::HeaderMap,
        body: &String,
    ) -> Result<cgi::Response, String> {
        let mut res = string_response(
            404,
            &serde_json::to_string(&NotFoundInfo {
                body: body.to_owned(),
                path: path.to_owned(),
                method: method.to_owned(),
            })
            .unwrap(),
        );

        res.headers_mut()
            .insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

        Ok(res)
    }
}
