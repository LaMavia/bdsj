use cgi::string_response;
use http::{header::CONTENT_TYPE, HeaderValue};
use serde::{Deserialize, Serialize};

use crate::router::{ApiRoute, Method};

#[derive(Serialize, Debug)]
struct HealthInfo {
    method: Method,
    body: String,
}

pub struct HealthRoute {}

impl ApiRoute for HealthRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::GET && path == "health"
    }

    fn run(
        &self,
        method: &Method,
        headers: &http::HeaderMap,
        body: &String,
    ) -> Result<cgi::Response, String> {
        let res_body = serde_json::to_string(&HealthInfo {
            method: method.to_owned(),
            body: body.to_owned(),
        })
        .map_err(|e| e.to_string())?;

        let mut res = string_response(200, res_body);

        res.headers_mut()
            .insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

        Ok(res)
    }
}
