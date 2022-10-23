// use std::path::{Path, PathBuf};

// use rocket::{fs::NamedFile, response::Redirect};

// #[macro_use]
// extern crate rocket;

// #[get("/<file..>")]
// async fn files(file: PathBuf) -> Option<NamedFile> {
//     NamedFile::open(Path::new("../client/dist/").join(file))
//         .await
//         .ok()
// }

// #[get("/")]
// async fn index() -> Redirect {
//     Redirect::to(uri!("/index.html"))
// }

// #[launch]
// fn rocket() -> _ {
//     rocket::build().mount("/", routes![index, files])
// }

use std::str::from_utf8;

use cgi::{text_response, Request};

extern crate cgi;

cgi::cgi_try_main! {
    |req: Request| -> Result<cgi::Response, String> {
        let body = from_utf8(req.body().as_slice()).map_err(|e| e.to_string())?;
        Ok(text_response(200, body))
    }
}
