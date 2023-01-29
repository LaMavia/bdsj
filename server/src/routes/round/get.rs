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
        *method == Method::POST && path == "round/get"
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

        let result: Vec<RoundEntry> = sqlx::query_as(
            format!(
                " select 
                participant_id,
                participant_country_code,
                position_initial,
                position_final,
                person_id,
                person_first_name,
                person_last_name,
                jump_score,
                jump_distance,
                round(score(participant_id, position_round_id) * 100)/100 score,
                disqualification_reason
              from position 
              inner join participant 
                on (participant_id = position_participant_id) 
              inner join person 
                on (person_id = participant_person_id) 
              left join jump 
                on (jump_round_id = position_round_id 
                    and jump_participant_id = participant_id) 
              left join disqualification 
                on (disqualification_round_id = position_round_id 
                    and disqualification_participant_id = participant_id)
              where position_round_id = {}
              order by position_final asc, position_initial asc
              ;",
                filters.round_id
            )
            .as_str(),
        )
        .fetch_all(&db.connection)
        .await
        .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
