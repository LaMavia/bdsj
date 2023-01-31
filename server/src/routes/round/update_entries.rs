use crate::{
    api_response::ApiResponse,
    database::Database,
    funcs::auth::auth_session_from_cookies,
    models::{disqualification::Disqualification, jump::Jump},
    router::{ApiRoute, Method, RouteContext},
};
use async_trait::async_trait;
use serde::{Deserialize, Serialize};

pub struct Route;

#[derive(Deserialize)]
struct DeletionInfo {
    pub round_id: i32,
    pub participant_id: i32,
}

#[derive(Deserialize)]
struct Body {
    pub changed_jumps: Vec<Jump>,
    pub deleted_jumps: Vec<DeletionInfo>,
    pub inserted_jumps: Vec<Jump>,
    pub changed_disqualifications: Vec<Disqualification>,
    pub deleted_disqualifications: Vec<DeletionInfo>,
    pub inserted_disqualifications: Vec<Disqualification>,
}

#[derive(Serialize)]
struct Response {
    rows_affected: u64,
}

#[async_trait]
impl ApiRoute for Route {
    fn test_route(&self, method: &Method, path: &String) -> bool {
        *method == Method::POST && path == "round/update_entries"
    }

    async fn run<'a>(&self, ctx: &'a RouteContext) -> Result<cgi::Response, String> {
        let db = Database::connect().await?;
        if let Err(res) = auth_session_from_cookies(&db, ctx).await {
            return res;
        }

        let body: Body = serde_json::from_str(&ctx.body).map_err(|e| {
            format!(
                "invalid body: {}, expected {{
                changed_jumps: Vec<Jump>,
                deleted_jumps: Vec<DeletionInfo>,
                changed_disqualifications: Vec<Disqualification>,
                deleted_disqualifications: Vec<DeletionInfo>,
              }}; error: {}",
                ctx.body,
                e.to_string()
            )
        })?;

        let mut tx = db.connection.begin().await.map_err(|e| e.to_string())?;
        let mut rows_affected = 0;

        for jump in body.changed_jumps.iter() {
            let r = sqlx::query!(
                "update jump set 
                jump_score = $1,
                jump_distance = $2
              where jump_round_id = $3 and jump_participant_id = $4;
              ",
                jump.jump_score,
                jump.jump_distance,
                jump.jump_round_id,
                jump.jump_participant_id
            )
            .execute(&mut tx)
            .await
            .map_err(|e| e.to_string())?;

            rows_affected += r.rows_affected();
        }

        for dis in body.changed_disqualifications.iter() {
            let r = sqlx::query!(
                "update disqualification set
                    disqualification_reason = $1
                where disqualification_round_id = $2 and disqualification_participant_id = $3;
            ",
                dis.disqualification_reason,
                dis.disqualification_round_id,
                dis.disqualification_participant_id
            )
            .execute(&mut tx)
            .await
            .map_err(|e| e.to_string())?;

            rows_affected += r.rows_affected();
        }

        for d_jump in body.deleted_jumps.iter() {
            let r = sqlx::query!(
                "delete from jump
                 where jump_round_id = $1
                 and jump_participant_id = $2;
                ",
                d_jump.round_id,
                d_jump.participant_id
            )
            .execute(&mut tx)
            .await
            .map_err(|e| e.to_string())?;

            rows_affected += r.rows_affected();
        }

        for d_dis in body.deleted_disqualifications.iter() {
            let r = sqlx::query!(
                "delete from disqualification
                 where disqualification_round_id = $1
                   and disqualification_participant_id = $2;
                ",
                d_dis.round_id,
                d_dis.participant_id
            )
            .execute(&mut tx)
            .await
            .map_err(|e| e.to_string())?;

            rows_affected += r.rows_affected();
        }

        for jump in body.inserted_jumps.iter() {
            let r = sqlx::query!(
                "insert into jump (
                    jump_participant_id,
                    jump_round_id,
                    jump_score,
                    jump_distance
                ) values ($1, $2, $3, $4);
                ",
                jump.jump_participant_id,
                jump.jump_round_id,
                jump.jump_score,
                jump.jump_distance
            )
            .execute(&mut tx)
            .await
            .map_err(|e| e.to_string())?;

            rows_affected += r.rows_affected();
        }

        for dis in body.inserted_disqualifications.iter() {
            let r = sqlx::query!(
                "insert into disqualification (
                    disqualification_participant_id,
                    disqualification_round_id,
                    disqualification_reason
                ) values ($1, $2, $3);
                ",
                dis.disqualification_participant_id,
                dis.disqualification_round_id,
                dis.disqualification_reason
            )
            .execute(&mut tx)
            .await
            .map_err(|e| e.to_string())?;

            rows_affected += r.rows_affected();
        }

        tx.commit().await.map_err(|e| e.to_string())?;
        ApiResponse::<_>::ok(&ctx.headers, Response { rows_affected }).send(200, None)
    }
}
