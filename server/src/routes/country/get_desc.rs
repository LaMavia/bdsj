use crate::{
    api_response::ApiResponse,
    database::Database,
    router::{ApiRoute, Method, RouteContext}, models::country::CountryDescInfo,
};
use async_trait::async_trait;
use serde::Deserialize;

pub struct Route;

#[derive(Deserialize)]
struct Body {
    code: String,
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "country/get/desc"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;

        let filters: Body = serde_json::from_str(&ctx.body).unwrap();

        let result: Option<CountryDescInfo> = sqlx::query_as(
            "
        with 
          counts as (
            select 
              participant_country_code country_code,
              count(distinct participant_tournament_id) t_count,
              count(distinct participant_person_id) p_count
            from participant 
            group by participant_country_code
          ),
          person_counts as (
            select 
              person_nationality country_code,
              count(person_id) n_count,
              sum(person_points) p_sum
            from person
            group by person_nationality
          )
        select
          country_code,
          country_name,
          coalesce(t_count, 0)::int4 country_tournaments,
          coalesce(p_count, 0)::int4 country_participants,
          coalesce(n_count, 0)::int4 country_nationals,
          coalesce(p_sum,   0)::int4 country_points
        from country
        left join counts 
          using (country_code)
        left join person_counts
          using (country_code)
        where country_code = $1
      ",
        )
        .bind(filters.code)
        .fetch_optional(&db.connection)
        .await
        .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
