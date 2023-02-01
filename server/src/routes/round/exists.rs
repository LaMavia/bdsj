use crate::{
    api_response::ApiResponse,
    database::Database,
    // funcs::filter::FilterBuilder,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

pub struct Route;
#[derive(Deserialize)]
struct Body {
    pub round_id: i32,
}

#[derive(Serialize, FromRow)]
struct RoundEntry {
    participant_id: i32,
    participant_country_code: String,
    position_initial: i32,
    position_final: Option<i32>,
    person_id: i32,
    person_first_name: String,
    person_last_name: String,
    jump_score: Option<f64>,
    jump_distance: Option<f64>,
    score: Option<f64>,
    disqualification_reason: Option<String>,
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "round/exists"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;

        let filters: Body = serde_json::from_str(&{
            if ctx.body.is_empty() {
                "{}".to_string()
            } else {
                ctx.body.clone()
            }
        })
        .unwrap();

        let result: bool = sqlx::query_scalar!(
            "select exists(
            select round_id
            from round
            where round_id = $1
          ) A;",
            filters.round_id
        )
        .fetch_one(&db.connection)
        .await
        .map_err(|e| e.to_string())?
        .unwrap_or(false);

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
