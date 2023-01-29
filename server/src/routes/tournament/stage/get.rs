use crate::{
    api_response::ApiResponse,
    database::Database,
    models::round::Round,
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
    stage_nr: i32,
    stage: Option<String>,
    qualifier: Option<Round>,
    first: Option<Round>,
    second: Option<Round>,
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "tournament/stage/get"
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

        let qualifier = sqlx::query_as!(
            Round,
            "select round_id, round_date 
            from tournament 
            inner join round r
                on (round_id = tournament_round_qualifier_id)
            where tournament_id = $1
            ;",
            req.tournament_id
        )
        .fetch_optional(&db.connection)
        .await
        .map_err(|e| format!("qualifier {}", e.to_string()))?;

        let first = sqlx::query_as!(
            Round,
            "select r.* 
            from tournament 
            inner join round r
                on (round_id = tournament_round_first_id)
            where tournament_id = $1
            ;",
            req.tournament_id
        )
        .fetch_optional(&db.connection)
        .await
        .map_err(|e| format!("first {}", e.to_string()))?;

        let second = sqlx::query_as!(
            Round,
            "select r.* 
            from tournament 
            inner join round r
                on (round_id = tournament_round_second_id)
            where tournament_id = $1
            ;",
            req.tournament_id
        )
        .fetch_optional(&db.connection)
        .await
        .map_err(|e| format!("second {}", e.to_string()))?;

        let stage = sqlx::query!(
            "select tournament_stage, stage_name(tournament_stage)
            from tournament 
            where tournament_id = $1
            ",
            req.tournament_id
        )
        .fetch_one(&db.connection)
        .await
        .map_err(|e| format!("stage {}", e.to_string()))?;

        ApiResponse::<_>::ok(
            &ctx.headers,
            Response {
                first,
                second,
                qualifier,
                stage: stage.stage_name,
                stage_nr: stage.tournament_stage
            },
        )
        .send(200, None)
    }
}
