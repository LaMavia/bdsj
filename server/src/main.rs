use std::{collections::HashMap, str::from_utf8};

use cgi::{html_response, Request};
use http::{header::HeaderName, HeaderValue};

extern crate cgi;

cgi::cgi_try_main! {
    |req: Request| -> Result<cgi::Response, String> {
        const QUERY_KEY: &str = "x-cgi-query-string";

        let body = from_utf8(req.body().as_slice()).map_err(|e| e.to_string())?;
        let method = req.method();
        let headers_raw = req.headers();

        let mut headers = HashMap::<String, String>::new();
        for (k, v) in headers_raw {
            headers.insert(k.to_string(), v.to_str().unwrap().to_string());
        }

        let mut query = HashMap::<String, String>::new();
        for (k, v) in querystring::querify(headers.get(&QUERY_KEY.to_string()).unwrap_or(&"".to_string())) {
            query.insert(k.to_string(), v.to_string());
        }

        Ok(html_response(200, format!("
        <!DOCTYPE html>
        <html lang=\"en\">
        <head>
            <title>{t}</title>
        </head>
        <body>
            <h1>Hello there</h1>
            <p>This appears to be a website :)</p>
            <span>method: {m}</span>
            <span>headers:</span>
            <pre>{hs:?}</pre>
            <span>body:</span>
            <pre>{b}</pre>
        </body>
        ", t=query.get(&"path".to_string()).unwrap_or(&"/".to_string()),
           m=method,
           hs=headers_raw.iter().collect::<Vec<(&HeaderName, &HeaderValue)>>(),
           b=body)))
    }
}
