use std::path::{Path, PathBuf};

use rocket::{fs::NamedFile, response::Redirect};

#[macro_use]
extern crate rocket;

#[get("/<file..>")]
async fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("../client/dist/").join(file))
        .await
        .ok()
}

#[get("/")]
async fn index() -> Redirect {
    Redirect::to(uri!("/index.html"))
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index, files])
}
