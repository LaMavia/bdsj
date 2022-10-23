use std::str::from_utf8;

use cgi::{html_response, Request};
use http::{header::HeaderName, HeaderValue};

extern crate cgi;

cgi::cgi_try_main! {
    |req: Request| -> Result<cgi::Response, String> {
        let body = from_utf8(req.body().as_slice()).map_err(|e| e.to_string())?;
        let method = req.method();
        let headers = req.headers();


        Ok(html_response(200, format!("
        <h1>Hello there</h1>
        <p>This appears to be a website :)</p>
        <span>method: {m}</span>
        <span>headers:</span>
        <pre>{hs:?}</pre>
        <span>body:</span>
        <pre>{b}</pre>
        ", m=method, hs=headers.iter().collect::<Vec<(&HeaderName, &HeaderValue)>>(), b=body)))
    }
}
