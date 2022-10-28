use cgi::{Request, Response};
use routes::make_router;

extern crate cgi;

mod router;
mod routes;

cgi::cgi_try_main! {
    |req: Request| -> Result<Response, String> {
        make_router().run(req)
    }
}
