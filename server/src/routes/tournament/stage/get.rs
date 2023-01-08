use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::filter::FilterBuilder,
    models::{round::Round, tournament::Tournament},
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::Postgres;

pub struct GetRoute;
#[derive(Deserialize)]
struct Body {
    tournament_id: i32,
}

#[derive(Serialize)]
struct Response {
    stage: i32,
    qualifier: Option<Round>,
    first: Option<Round>,
    second: Option<Round>,
}

#[async_trait]
impl ApiRoute for GetRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::GET && path == "tournament/stage/get"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;

        let req: Body = serde_json::from_str(&ctx.body).map_err(|e| {
            format!(
                "invalid body: {}, expected {{tournament_id: number}}; error: {}",
                ctx.body,
                e.to_string()
            )
        })?;

        let result = ();

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
