use crate::router::Router;

use self::{health::HealthRoute, not_found::NotFoundRoute};

mod health;
mod not_found;

pub fn make_router() -> Router {
    let mut router = Router::make();

    router.mount(HealthRoute {})
          .mount(NotFoundRoute::new());

    router
}
