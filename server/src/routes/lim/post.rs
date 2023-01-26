use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::auth::auth_session_from_cookies,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};

pub struct Route;
#[derive(Deserialize)]
struct Body {
    pub tournament_id: i32,
    pub country_code: String,
    pub amount: i32,
}

#[derive(Serialize)]
struct Response {
    rows_affected: u64,
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "lim/post"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;
        if let Err(res) = auth_session_from_cookies(&db, ctx).await {
            return res;
        }

        let body: Body = serde_json::from_str(&ctx.body).map_err(|e| {
            format!(
                "invalid body: {}, expected {{
                  tournament_id: number,
                  country_code: string,
                  amount: number,
              }}; error: {}",
                ctx.body,
                e.to_string()
            )
        })?;

        let result = sqlx::query!(
            "insert into lim(
            lim_tournament_id, 
            lim_country_code, 
            lim_amount
          ) values ($1, $2, $3)",
            body.tournament_id,
            body.country_code,
            body.amount
        )
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
