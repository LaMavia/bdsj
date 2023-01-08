use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::filter::FilterBuilder,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Postgres};

pub struct GetRoute;
#[derive(Deserialize)]
struct Body {
    names: Option<Vec<String>>,
    years: Option<Vec<i32>>,
    locations: Option<Vec<i32>>,
    stages: Option<Vec<i32>>,
    hosts: Option<Vec<String>>,
}

#[derive(Serialize, FromRow)]
struct TournamentInfo {
    pub tournament_id: i32,
    pub tournament_name: String,
    pub tournament_year: i32,
    pub tournament_location_city: String,
    pub tournament_location_name: String,
    pub tournament_stage: i32,
    pub tournament_host: String,
}

#[async_trait]
impl ApiRoute for GetRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::GET && path == "tournament/get"
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

        let result = FilterBuilder::new(
            "tournament",
            "select 
                tournament_id, 
                tournament_name, 
                tournament_year, 
                tournament_stage,
                l.location_city tournament_location_city,
                l.location_name tournament_location_name,
                tournament_host 
            from tournament
            left join location l 
                on (l.location_id = tournament_location_id)
            where ",
        )
        .add("name", filters.names)
        .add("year", filters.years)
        .add("host", filters.hosts)
        .add("location_id", filters.locations)
        .add("stage", filters.stages)
        .build_query_as::<Postgres, TournamentInfo>()
        .fetch_all(&db.connection)
        .await
        .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
