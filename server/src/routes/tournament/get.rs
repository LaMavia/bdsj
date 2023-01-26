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
    ids: Option<Vec<i32>>,
}

#[derive(Serialize, FromRow)]
struct TournamentInfo {
    pub tournament_id: i32,
    pub tournament_name: String,
    pub tournament_year: i32,
    pub tournament_location_city: String,
    pub tournament_location_name: String,
    pub tournament_location_id: i32,
    pub tournament_stage: i32,
    pub tournament_host_code: String,
    pub tournament_host_name: String,
    pub tournament_participant_count: i64,
    pub tournament_country_participating_count: i64,
    pub tournament_country_count: i64,
    pub tournament_total_tickets: i64
}

#[async_trait]
impl ApiRoute for GetRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "tournament/get"
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
            "
            with participation_info as (
                select 
                    participant_tournament_id     tournament_id, 
                    count(participant_person_id)  tournament_participant_count,
                    count(distinct 
                        participant_country_code) tournament_country_participating_count
                from 
                    participant
                group by 
                    participant_tournament_id
            ),
            country_info as (
                select
                    lim_tournament_id       tournament_id,
                    count(lim_country_code) tournament_country_count,
                    sum(lim_amount)         tournament_total_tickets
                from lim
                group by tournament_id 
            )
            -- ---------------------------------------
            --                                      --
            --              MAIN QUERY              --
            --                                      --
            -- ---------------------------------------
            select 
                tournament_id, 
                tournament_name, 
                tournament_year, 
                tournament_stage,
                location_city   tournament_location_city,
                location_name   tournament_location_name,
                location_id     tournament_location_id,
                tournament_host tournament_host_code,
                country_name    tournament_host_name,
                coalesce(
                    tournament_participant_count, 
                    0)          tournament_participant_count,
                coalesce(
                    tournament_country_participating_count,
                    0      
                )               tournament_country_participating_count,
                coalesce(
                    tournament_country_count,
                    0      
                )               tournament_country_count,
                coalesce(
                    tournament_total_tickets,
                    0      
                )               tournament_total_tickets
            from tournament
            left join location 
                on (location_id = tournament_location_id)
            left join country
                on (country_code = tournament_host)
            left join participation_info 
                using (tournament_id)
            left join country_info 
                using (tournament_id)
            where ",
        )
        .add("name", filters.names)
        .add("year", filters.years)
        .add("host", filters.hosts)
        .add("location_id", filters.locations)
        .add("stage", filters.stages)
        .add("id", filters.ids)
        .build_query_as::<Postgres, TournamentInfo>()
        .fetch_all(&db.connection)
        .await
        .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
