use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::filter::FilterBuilder,
    models::lim::Lim,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::Deserialize;
use sqlx::Postgres;

pub struct Route;
#[derive(Deserialize)]
struct Body {
    pub tournament_ids: Option<Vec<i32>>,
    pub country_codes: Option<Vec<String>>,
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "lim/get"
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

        let result = FilterBuilder::new("lim", "select * from lim where ")
            .add("tournament_id", filters.tournament_ids)
            .add("country_code", filters.country_codes)
            .build_query_as::<Postgres, Lim>()
            .fetch_all(&db.connection)
            .await
            .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
