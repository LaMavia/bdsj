use crate::{
    api_response::ApiResponse,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::Serialize;

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

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        ApiResponse::<String, _>::error(&ctx.headers, format!("Couldn't find path {} [{}]", ctx.path, ctx.method))
            .send(404, None)
    }
}
