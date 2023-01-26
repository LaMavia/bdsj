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
    pub first_name: String,
    pub last_name: String,
    pub gender: String,
    pub nationality: String,
}

#[derive(Serialize)]
struct Response {
    rows_affected: u64,
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "person/post"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;
        if let Err(res) = auth_session_from_cookies(&db, ctx).await {
            return res;
        }

        let body: Body = serde_json::from_str(&ctx.body).map_err(|e| {
            format!(
                "invalid body: {}, expected {{
                first_name: String,
                last_name: String,
                gender: String,
                nationality: String,
            }}; error: {}",
                ctx.body,
                e.to_string()
            )
        })?;

        let result = sqlx::query!(
            "insert into person(
            person_first_name,
            person_last_name,
            person_gender,
            person_nationality
        ) values ($1, $2, $3, $4)",
            body.first_name,
            body.last_name,
            body.gender,
            body.nationality
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
