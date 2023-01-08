use async_trait::async_trait;
use http::{header::SET_COOKIE, HeaderMap, HeaderValue};

use crate::{
    api_response::ApiResponse,
    router::{ApiRoute, Method, RouteContext},
};
pub struct EndSessionRoute {}

#[async_trait]
impl ApiRoute for EndSessionRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "end_session"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let mut res_headers = HeaderMap::new();
        res_headers.insert(
            SET_COOKIE,
            HeaderValue::from_str("session_key=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/").unwrap(),
        );

        ApiResponse::<(), ()>::ok(&ctx.headers, ()).send(200, Option::Some(res_headers))
    }
}
