use crate::{
    api_response::ApiResponse,
    database::Database,
    models::country::CountryEntryInfo,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;

pub struct Route;

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "countries/get"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;

        let result: Vec<CountryEntryInfo> = sqlx::query_as(
            "
          with 
            counts as (
            select 
              participant_country_code country_code,
              count(distinct participant_tournament_id) t_count,
              count(distinct participant_person_id) p_count
            from participant 
            group by participant_country_code
          )
          select
            country_code,
            country_name,
            coalesce(t_count, 0)::int4 country_tournaments,
            coalesce(p_count, 0)::int4 country_participants
          from country
          left join counts 
            using (country_code)
        ",
        )
        .fetch_all(&db.connection)
        .await
        .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
