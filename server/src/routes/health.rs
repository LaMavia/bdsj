use crate::api_response::ApiResponse;
use crate::database::Database;
use crate::funcs::auth;
use crate::router::{ApiRoute, Method, RouteContext};
use async_trait::async_trait;
use serde::Serialize;

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

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;
        match auth::auth_session_from_cookies(&db, &ctx.cookies, &"1 day".to_string()).await {
            Ok(()) => ApiResponse::<HealthInfo, String>::ok(HealthInfo {
                method: ctx.method.to_owned(),
                body: ctx.body.to_owned(),
            })
            .send(200, None),
            Err(e_res) => e_res,
        }
    }
}
