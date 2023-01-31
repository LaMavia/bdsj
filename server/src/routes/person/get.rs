use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::filter::FilterBuilder,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::Postgres;

pub struct Route;
#[derive(Deserialize)]
struct Body {
    pub ids: Option<Vec<i32>>,
    pub first_names: Option<Vec<String>>,
    pub last_names: Option<Vec<String>>,
    pub genders: Option<Vec<String>>,
    pub nationalities: Option<Vec<String>>,
}

#[derive(Serialize, sqlx::FromRow)]
struct PersonInfo {
    pub person_id: i32,
    pub person_first_name: String,
    pub person_last_name: String,
    pub person_gender: String,
    pub person_nationality_code: String,
    pub person_nationality_name: String,
    pub person_points: i32,
    pub person_participations: i32
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "person/get"
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
            "person",
            "
          with participations as (
            select 
                participant_person_id person_id,
                count(participant_tournament_id)::int4 p_count
            from participant 
            group by participant_person_id
          )
          select 
            person_id,
            person_first_name,
            person_last_name,
            person_gender,
            person_points,
            person_nationality   person_nationality_code,
            country_name         person_nationality_name,
            coalesce(p_count, 0) person_participations
          from person 
          inner join country 
            on (country_code = person_nationality)
          left join participations 
            using (person_id)
          where ",
        )
        .add("id", filters.ids.clone())
        .add("first_name", filters.first_names.clone())
        .add("last_name", filters.last_names.clone())
        .add("gender", filters.genders.clone())
        .add("nationality", filters.nationalities.clone())
        .build_query_as::<Postgres, PersonInfo>()
        .fetch_all(&db.connection)
        .await
        .map_err(|e| {
            let x = FilterBuilder::new(
                "person",
                "
              with participations as (
                select 
                    person_id,
                    count(participation_tournament_id) p_count
                from participation 
                    on (person_id = participation_person_id)
                group by participation_person_id
              )
              select 
                person_id,
                person_first_name,
                person_last_name,
                person_gender,
                person_points,
                person_nationality   person_nationality_code,
                country_name         person_nationality_name,
                coalesce(p_count, 0) person_participations
              from person 
              inner join country 
                on (country_code = person_nationality)
              left join participations 
                using (person_id)
              where ",
            )
            .add("id", filters.ids)
            .add("first_name", filters.first_names)
            .add("last_name", filters.last_names)
            .add("gender", filters.genders)
            .add("nationality", filters.nationalities).sql();

            format!("error: {}; query:\n{}", e.to_string(), x)
        })?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
