use crate::router::Router;

use self::{
    auth::AuthRoute, countries::CountriesRoute, end_session::EndSessionRoute, health::HealthRoute,
    not_found::NotFoundRoute,
};

mod auth;
mod countries;
mod end_session;
mod health;
mod not_found;

pub fn make_router() -> Router {
    let mut router = Router::make();

    router
        .mount(HealthRoute {})
        .mount(CountriesRoute {})
        .mount(AuthRoute {})
        .mount(EndSessionRoute {})
        .mount(NotFoundRoute {});
    router
}
