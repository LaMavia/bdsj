use cgi::{Request, Response};
use dotenvy::dotenv;
use routes::make_router;

extern crate cgi;

pub mod models;
mod router;
mod routes;
pub mod schema;
pub mod api_response;
pub mod database;

cgi::cgi_try_main! {
    |req: Request| -> Result<Response, String> {
        dotenv().ok();
        make_router().run(req)
    }
}
