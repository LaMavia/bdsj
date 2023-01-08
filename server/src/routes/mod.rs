use crate::router::Router;

use self::{
    auth::AuthRoute, countries::CountriesRoute, country::CountryPack, end_session::EndSessionRoute,
    health::HealthRoute, not_found::NotFoundRoute, tournament::TournamentPack,
};

mod auth;
mod countries;
mod country;
mod end_session;
mod health;
mod not_found;
mod tournament;
mod location;

pub fn make_router() -> Router {
    let mut router = Router::make();

    router
        .mount(HealthRoute {})
        .mount(CountriesRoute {})
        .mount(AuthRoute {})
        .mount(EndSessionRoute {})
        .mount_pack(TournamentPack {})
        .mount_pack(CountryPack {})
        .mount(NotFoundRoute {});

    router
}
