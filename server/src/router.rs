use std::{
    collections::HashMap,
    str::{from_utf8, Split},
};

use cgi::{Request, Response};
use http::{header::COOKIE, HeaderMap};
use serde::{Deserialize, Serialize};
use std::fmt;

use crate::api_response::ApiResponse;
use async_trait::async_trait;

#[derive(Deserialize, Serialize, PartialEq, Eq, Debug, Clone, Copy)]
pub enum Method {
    GET,
    POST,
    DELETE,
}

impl Method {
    pub fn from_http(method: &http::Method) -> Self {
        match *method {
            http::Method::GET => Method::GET,
            http::Method::DELETE => Method::DELETE,
            http::Method::POST => Method::POST,
            _ => Method::GET,
        }
    }
}

impl fmt::Display for Method {
    // This trait requires `fmt` with this exact signature.
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // Write strictly the first element into the supplied output
        // stream: `f`. Returns `fmt::Result` which indicates whether the
        // operation succeeded or failed. Note that `write!` uses syntax which
        // is very similar to `println!`.
        write!(f, "{:?}", self)
    }
}

#[async_trait]
pub trait ApiRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool;

    async fn run<'a>(
        &self,
        method: &'a Method,
        path: &'a String,
        headers: &'a HeaderMap,
        cookies: &'a HashMap<String, String>,
        body: &'a String,
    ) -> Result<Response, String>;
}

pub struct Router {
    routes: Vec<Box<dyn ApiRoute>>,
}

impl Router {
    pub fn make() -> Self {
        Self { routes: vec![] }
    }

    pub fn mount<T: ApiRoute + 'static>(&mut self, route: T) -> &mut Self {
        self.routes.push(Box::new(route));

        self
    }

    fn parse_cookies<'a>(headers: &'a HeaderMap) -> HashMap<String, String> {
        let mut cookies = HashMap::new();
        match headers.get(COOKIE) {
            Some(qv) => {
                for def in qv.to_str().unwrap().split("; ").into_iter() {
                    match def.split_once("=") {
                        Some((key, val)) => {
                            cookies.insert(key.to_owned(), val.to_owned());
                        }
                        None => {}
                    }
                }
            }
            None => {}
        }

        cookies
    }

    pub async fn run(&self, req: Request) -> Result<Response, String> {
        const QUERY_KEY: &str = "x-cgi-query-string";

        let body = from_utf8(req.body().as_slice())
            .map_err(|e| e.to_string())?
            .to_string();
        let method = &Method::from_http(req.method());
        let headers = req.headers();
        let cookies = Self::parse_cookies(headers);

        let mut query = HashMap::<String, String>::new();
        for (k, v) in querystring::querify(
            &headers
                .get(QUERY_KEY)
                .unwrap()
                .to_str()
                .unwrap()
                .to_string(),
        ) {
            query.insert(k.to_string(), v.to_string());
        }

        let path = query
            .get(&"path".to_string())
            .unwrap_or(&"/".to_string())
            .to_owned();

        for route in self.routes.iter() {
            if route.test_route(method, &path) {
                return match route.run(method, &path, headers, &cookies, &body).await {
                    Ok(res) => Ok(res),
                    Err(msg) => ApiResponse::<String, String>::error(msg).send(500, None),
                };
            }
        }

        Err(format!("Path {path} not found"))
    }
}
