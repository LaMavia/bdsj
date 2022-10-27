use std::{collections::HashMap, str::from_utf8};

use cgi::{html_response, Request};
use http::{header::HeaderName, HeaderValue};
use routes::make_router;

extern crate cgi;

mod router;
mod routes;

cgi::cgi_try_main! {
    |req: Request| -> Result<cgi::Response, String> {
        let router = make_router();

        router.run(req)

        // Ok(html_response(200, format!("
        // <!DOCTYPE html>
        // <html lang=\"en\">
        // <head>
        //     <title>{t}</title>
        // </head>
        // <body>
        //     <h1>Hello there</h1>
        //     <p>This appears to be a website :)</p>
        //     <span>method: {m}</span>
        //     <span>headers:</span>
        //     <pre>{hs:?}</pre>
        //     <span>body:</span>
        //     <pre>{b}</pre>
        // </body>
        // ", t=query.get(&"path".to_string()).unwrap_or(&"/".to_string()),
        //    m=method,
        //    hs=headers.iter().collect::<Vec<(&HeaderName, &HeaderValue)>>(),
        //    b=body)))
    }
}
