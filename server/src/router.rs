use std::{collections::HashMap, str::from_utf8};

use cgi::{Request, Response};
use http::HeaderMap;
use serde::{Deserialize, Serialize};

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

pub trait ApiRoute {
    fn test_route(&self, method: &Method, path: &String) -> bool;

    fn run(&self, method: &Method, headers: &HeaderMap, body: &String) -> Result<Response, String>;
}

pub struct Router {
    routes: Vec<Box<dyn ApiRoute>>,
}

impl Router {
    pub fn make() -> Self {
        Self { routes: vec![] }
    }

    pub fn mount<T: ApiRoute + 'static>(&mut self, route: T) -> &Self {
        self.routes.push(Box::new(route));

        self
    }

    pub fn run(&self, req: Request) -> Result<Response, String> {
        const QUERY_KEY: &str = "x-cgi-query-string";

        let body = from_utf8(req.body().as_slice())
            .map_err(|e| e.to_string())?
            .to_string();
        let method = &Method::from_http(req.method());
        let headers = req.headers();

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
                return route.run(method, headers, &body);
            }
        }

        Err(format!("Path {path} not found"))
    }
}
