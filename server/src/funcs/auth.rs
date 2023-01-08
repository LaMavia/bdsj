use crate::{api_response::ApiResponse, database::Database, router::RouteContext};
use sqlx::Row;

pub(crate) async fn auth_session<T: ToString>(
    db: &Database,
    session_id: &String,
    duration: &T,
) -> Result<(), String> {
    sqlx::query("select authenticate($1, $2 :: interval);")
        .bind(session_id)
        .bind(duration.to_string())
        .fetch_one(&db.connection)
        .await
        .map(|_| ())
        .map_err(|e| e.to_string())
}

pub(crate) async fn auth_session_from_cookies(
    db: &Database,
    ctx: &RouteContext
) -> Result<(), Result<cgi::Response, String>> {
    let duration = &"1 day".to_string();
    match ctx.cookies.get("session_key") {
        Some(session_key) => match auth_session(&db, session_key, duration).await {
            Ok(()) => Ok(()),
            Err(e) => {
                Err(ApiResponse::<String, String>::error(&ctx.headers, e).send(403, None))
            }
        },
        None => Err(ApiResponse::<String, String>::error(
            &ctx.headers,
            "user not in session".to_string(),
        )
        .send(403, None)),
    }
}

pub(crate) async fn start_session<T: ToString, V: ToString>(
    db: &Database,
    password: T,
    duration: V,
) -> Result<String, String> {
    match sqlx::query("select start_session($1, $2 :: interval)")
        .bind(password.to_string())
        .bind(duration.to_string())
        .fetch_one(&db.connection)
        .await
        .map_err(|e| e.to_string())
    {
        Ok(row) => match row.try_get(0) {
            Ok(v) => Ok(v),
            Err(e) => Err(e.to_string()),
        },
        Err(e) => Err(e),
    }
}
