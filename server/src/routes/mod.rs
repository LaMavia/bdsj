use crate::router::{Mounter, Router};

use self::{
    auth::AuthRoute, countries::CountriesRoute, end_session::EndSessionRoute, health::HealthRoute,
    not_found::NotFoundRoute, tournaments::TournamentsPack,
};

mod auth;
mod countries;
mod end_session;
mod health;
mod not_found;
mod tournaments;

pub fn make_router() -> Router {
    let mut router = Router::make();

    TournamentsPack::mount(&mut router);
    router
        .mount(HealthRoute {})
        .mount(CountriesRoute {})
        .mount(AuthRoute {})
        .mount(EndSessionRoute {})
        .mount(NotFoundRoute {});

    router
}
