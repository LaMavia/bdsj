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

use cgi::{html_response, Request};

extern crate cgi;

cgi::cgi_try_main! {
    |req: Request| -> Result<cgi::Response, String> {
        let body = from_utf8(req.body().as_slice()).map_err(|e| e.to_string())?;
        Ok(html_response(200, format!("
        <h1>Hello there</h1>
        <p>This appears to be a website :)</p>
        <pre>{}</pre>
        ", body)))
    }
}
