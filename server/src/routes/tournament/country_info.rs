use crate::{
    api_response::ApiResponse,
    database::Database,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

pub struct CountriesGet;
#[derive(Deserialize)]
struct Body {
    tournament_id: i32,
}

#[derive(Serialize, FromRow)]
struct CountryInfo {
    pub country_code: String,
    pub country_name: String,
    pub country_participant_count: Option<i64>,
}

#[async_trait]
impl ApiRoute for CountriesGet {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "tournament/countries/get"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;

        let filters: Body = serde_json::from_str(&ctx.body).map_err(|e| {
            format!(
                "invalid body: {}, expected {{
                    tournament_id: i32,
              }}; error: {}",
                ctx.body,
                e.to_string()
            )
        })?;

        let result = sqlx::query_as!(
            CountryInfo,
            "
            select
                country_code,
                country_name,
                coalesce(
                    count(participant_id),
                    0
                ) country_participant_count
            from lim
            left join country
                on (lim_country_code = country_code)
            left join participant
                on (participant_country_code = country_code)
            where lim_tournament_id = $1
            group by country_code, country_name
            ",
            filters.tournament_id
        )
        .fetch_all(&db.connection)
        .await
        .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
