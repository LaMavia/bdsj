use cgi::{Request, Response};
use routes::make_router;

extern crate cgi;

pub mod models;
mod router;
mod routes;
pub mod schema;

cgi::cgi_try_main! {
    |req: Request| -> Result<Response, String> {
        make_router().run(req)
    }
}
