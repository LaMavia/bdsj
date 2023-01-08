use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::auth::auth_session_from_cookies,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};

pub struct PutRoute;
#[derive(Deserialize)]
struct Body {
    name: String,
    code: String,
}

#[derive(Serialize)]
struct Response {
    rows_affected: u64,
}

#[async_trait]
impl ApiRoute for PutRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::PUT && path == "country/put"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;
        if let Err(res) = auth_session_from_cookies(&db, ctx).await {
            return res;
        }

        let body: Body = serde_json::from_str(&ctx.body).map_err(|e| {
            format!(
                "invalid body: {}, expected {{name: string, code: string}}; error: {}",
                ctx.body,
                e.to_string()
            )
        })?;

        let result = sqlx::query!(
            "insert into country(country_code, country_name) values ($1, $2)",
            body.code,
            body.name
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
