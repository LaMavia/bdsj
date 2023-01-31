use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::auth::auth_session_from_cookies,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};

pub struct DeleteRoute;
#[derive(Deserialize)]
struct Body {
    code: String,
}

#[derive(Serialize)]
struct Response {
    rows_affected: u64,
}

#[async_trait]
impl ApiRoute for DeleteRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "country/delete"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;

        if let Err(res) = auth_session_from_cookies(&db, ctx).await {
            return res;
        }

        let params: Body = serde_json::from_str(&ctx.body).map_err(|_| {
            format!(
                "invalid request body: {}, expected {{code: string}}",
                ctx.body
            )
        })?;

        let result = sqlx::query!("delete from country where country_code = $1", params.code)
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
