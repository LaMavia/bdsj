use crate::router::Router;

use self::{health::HealthRoute, not_found::NotFoundRoute, countries::CountriesRoute};

mod health;
mod countries;
mod not_found;

pub fn make_router() -> Router {
    let mut router = Router::make();

    router.mount(HealthRoute {})
          .mount(CountriesRoute {})
          .mount(NotFoundRoute {});

    router
}
