use crate::{
    api_response::ApiResponse,
    database::Database,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};

pub struct Route;
#[derive(Deserialize)]
struct Body {
    tournament_id: i32,
}

#[derive(Serialize, sqlx::FromRow)]
struct Response {
    rows_affected: u64,
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "tournament/stage/next"
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

        let result = sqlx::query!("select next_stage($1);", req.tournament_id)
            .execute(&db.connection)
            .await
            .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(
            &ctx.headers,
            Response {
                rows_affected: result.rows_affected(),
            },
        )
        .send(200, None)
    }
}
