use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::filter::FilterBuilder,
    models::person::Person,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::Deserialize;
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

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "person/get/short"
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
                    ids: Option<Vec<i32>>,
                    first_names: Option<Vec<String>>,
                    last_names: Option<Vec<String>>,
                    genders: Option<Vec<String>>,
                    nationalities: Option<Vec<String>>,
              }}; error: {}",
                ctx.body,
                e.to_string()
            )
        })?;

        let result = FilterBuilder::new("person", "select * from person where ")
            .add("id", filters.ids)
            .add("first_name", filters.first_names)
            .add("last_name", filters.last_names)
            .add("gender", filters.genders)
            .add("nationality", filters.nationalities)
            .build_query_as::<Postgres, Person>()
            .fetch_all(&db.connection)
            .await
            .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
