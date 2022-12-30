use cgi::{string_response, Response};
use http::{header::CONTENT_TYPE, HeaderMap, HeaderValue, StatusCode};
use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T: Serialize, E: Serialize> {
    data: Option<T>,
    error: Option<E>,
    ok: bool,
}

impl<T: Serialize, E: Serialize> ApiResponse<T, E> {
    pub fn ok(data: T) -> Self {
        Self {
            data: Option::Some(data),
            error: Option::None,
            ok: true,
        }
    }

    pub fn error(error: E) -> Self {
        Self {
            data: Option::None,
            error: Option::Some(error),
            ok: false,
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
        for (k, v) in headers.unwrap_or_default().iter() {
            res.headers_mut().insert(k, v.to_owned());
        }

        Ok(res)
    }
}
