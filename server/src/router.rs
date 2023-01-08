use std::{collections::HashMap, str::from_utf8};

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
    PUT
}

impl Method {
    pub fn from_http(method: &http::Method) -> Self {
        match *method {
            http::Method::GET => Method::GET,
            http::Method::DELETE => Method::DELETE,
            http::Method::POST => Method::POST,
            http::Method::PUT => Method::PUT,
            _ => Method::GET,
        }
    }
}

impl fmt::Display for Method {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

pub struct RouteContext {
    pub method: Method,
    pub path: String,
    pub headers: http::HeaderMap,
    pub cookies: HashMap<String, String>,
    pub body: String,
}

#[async_trait]
pub trait ApiRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool;

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<Response, String>;
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

    pub fn mount_pack<T: Mounter>(&mut self, pack: T) -> &mut Self {
        pack.mount(self)
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

        let ctx = RouteContext {
            method: method.to_owned(),
            path: path.clone(),
            headers: headers.to_owned(),
            cookies,
            body,
        };

        for route in self.routes.iter() {
            if route.test_route(method, &path) {
                return match route.run(&ctx).await {
                    Ok(res) => Ok(res),
                    Err(msg) => {
                        ApiResponse::<String, String>::error(&ctx.headers, msg).send(500, None)
                    }
                };
            }
        }

        Err(format!("Path {path} not found"))
    }
}

pub trait Mounter {
    fn mount(self, router: &mut Router) -> &mut Router;
}
