use crate::{
  api_response::ApiResponse,
  database::Database,
  funcs::filter::FilterBuilder,
  models::country::Country,
  router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::Deserialize;
use sqlx::Postgres;

pub struct Route;
#[derive(Deserialize)]
struct Body {
  codes: Option<Vec<String>>,
}

#[async_trait]
impl ApiRoute for Route {
  fn test_route(&self, method: &Method, path: &String) -> bool {
      *method == Method::POST && path == "country/get/desc"
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

      let result = FilterBuilder::new("country", "select * from country where ")
          .add("code", filters.codes)
          .build_query_as::<Postgres, Country>()
          .fetch_all(&db.connection)
          .await
          .map_err(|e| e.to_string())?;

      ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
  }
}
