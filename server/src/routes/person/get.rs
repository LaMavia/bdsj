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

        let result = FilterBuilder::new("person", "
          select 
            person_id,
            person_first_name,
            person_last_name,
            person_gender,
            person_nationality person_nationality_code,
            country_name       person_nationality_name
          from person 
          left join country 
            on (country_code = person_nationality)
          where ")
            .add("id", filters.ids)
            .add("first_name", filters.first_names)
            .add("last_name", filters.last_names)
            .add("gender", filters.genders)
            .add("nationality", filters.nationalities)
            .build_query_as::<Postgres, PersonInfo>()
            .fetch_all(&db.connection)
            .await
            .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
