use cgi::{Request, Response};
use dotenvy::dotenv;
use routes::make_router;

extern crate async_trait;
extern crate cgi;

pub mod api_response;
pub mod database;
pub mod funcs;
pub mod models;
mod router;
mod routes;

cgi::cgi_try_main! {
    |req: Request| -> Result<Response, String> {
        dotenv().ok();
        tokio::runtime::Runtime::new().unwrap().block_on(
            make_router().run(req)
        )
    }
}
