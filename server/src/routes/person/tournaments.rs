use crate::{
    api_response::ApiResponse,
    database::Database,
    models::tournament::TournamentShortInfo,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::Deserialize;

pub struct Route;
#[derive(Deserialize)]
struct Body {
    pub id: i32,
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "person/get/tournaments"
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
        .map_err(|e| {
            format!(
                "invalid body: {}, expected {{
                id: i32,
            }}; error: {}",
                ctx.body,
                e.to_string()
            )
        })?;

        let result = sqlx::query_as!(
            TournamentShortInfo,
            "
          select 
            tournament_id,
            tournament_name,
            tournament_year,
            tournament_location_id,
            location_city tournament_location_city,
            location_name tournament_location_name,
            tournament_host
          from tournament
          inner join location 
            on (tournament_location_id = location_id)
          where tournament_id in (
            select participant_tournament_id
            from participant
            where participant_person_id = $1
          );
        ", filters.id
        )
        .fetch_all(&db.connection)
        .await
        .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
