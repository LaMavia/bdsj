use cgi::{string_response, Response};
use http::{
    header::{ACCESS_CONTROL_ALLOW_CREDENTIALS, ACCESS_CONTROL_ALLOW_ORIGIN, CONTENT_TYPE, ORIGIN},
    HeaderMap, HeaderValue, StatusCode,
};
use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T: Serialize = (), E: Serialize = ()> {
    data: Option<T>,
    error: Option<E>,
    ok: bool,
    #[serde(skip_serializing)]
    req_headers: HeaderMap,
}

impl<T: Serialize, E: Serialize> ApiResponse<T, E> {
    pub fn ok(req_headers: &HeaderMap, data: T) -> Self {
        Self {
            data: Option::Some(data),
            error: Option::None,
            ok: true,
            req_headers: req_headers.clone(),
        }
    }

    pub fn error(req_headers: &HeaderMap, error: E) -> Self {
        Self {
            data: Option::None,
            error: Option::Some(error),
            ok: false,
            req_headers: req_headers.clone(),
        }
    }

    pub fn send<S>(&self, status: S, headers: Option<HeaderMap>) -> Result<Response, String>
    where
        StatusCode: TryFrom<S>,
    {
        let body = serde_json::to_string(self).map_err(|e| e.to_string())?;
        let x = StatusCode::try_from(status).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);

        let mut res = string_response::<StatusCode, String>(x, body);
        res.headers_mut()
            .insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
        res.headers_mut().insert(
            ACCESS_CONTROL_ALLOW_ORIGIN,
            self.req_headers
                .get(ORIGIN)
                .unwrap_or(&HeaderValue::from_static("*"))
                .clone(),
        );
        res.headers_mut().insert(
            ACCESS_CONTROL_ALLOW_CREDENTIALS,
            HeaderValue::from_static("true"),
        );
        for (k, v) in headers.unwrap_or_default().iter() {
            res.headers_mut().insert(k, v.to_owned());
        }

        Ok(res)
    }
}
