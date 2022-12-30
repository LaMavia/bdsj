use diesel::QueryableByName;

use crate::api_response::ApiResponse;
use crate::database::Database;
use crate::models::count::Count;
use crate::models::country::Country;
use crate::router::{ApiRoute, Method};
use crate::schema::country::dsl::*;

pub struct CountriesRoute {}

// impl ApiRoute for CountriesRoute {
//     fn test_route(&self, method: &Method, path: &String) -> bool {
//         *method == Method::GET && path == "countries"
//     }

//     fn run(
//         &self,
//         _method: &Method,
//         _path: &String,
//         _headers: &http::HeaderMap,
//         _body: &String,
//     ) -> Result<cgi::Response, String> {
//         let mut db = Database::connect()?;
//         // let countries = 
//     }
// }
