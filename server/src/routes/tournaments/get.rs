use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::{auth, filter::FilterBuilder},
    models::tournament::Tournament,
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgStatement, Postgres, QueryBuilder, Statement};

pub struct GetRoute;
// create table? tournament (
//     &id,
//     @_name varchar(255)!,
//     @_year integer!,
//     &ref location_id integer!,
//     @_stage integer!,
//     @_host char(2)! -> country_code,
//     @_round_qualifier_id integer,
//     @_round_first_id integer! -> round_id,
//     @_round_second_id integer! -> round_id
// );
#[derive(Deserialize)]
struct Body {
    names: Option<Vec<String>>,
    years: Option<Vec<i32>>,
    locations: Option<Vec<i32>>,
    stages: Option<Vec<i32>>,
    hosts: Option<Vec<String>>,
}

#[derive(Serialize)]
struct TestR {
    query: String,
    result: Vec<Tournament>,
}

#[async_trait]
impl ApiRoute for GetRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::GET && path == "tournaments/get"
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

        let result = FilterBuilder::new("tournament", "select * from tournament where ")
            .add("name", filters.names)
            .add("year", filters.years)
            .add("host", filters.hosts)
            .add("location_id", filters.locations)
            .add("stage", filters.stages)
            .build_query_as::<Postgres, Tournament>()
            .fetch_all(&db.connection)
            .await
            .map_err(|e| e.to_string())?;

        ApiResponse::<_>::ok(&ctx.headers, result).send(200, None)
    }
}
