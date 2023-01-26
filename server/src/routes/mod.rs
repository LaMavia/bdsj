use crate::router::Router;

use self::{
    auth::AuthRoute, countries::CountriesRoute, country::CountryPack, end_session::EndSessionRoute,
    health::HealthRoute, location::LocationPack, not_found::NotFoundRoute,
    tournament::TournamentPack, lim::LimPack,
};

mod auth;
mod countries;
mod country;
mod end_session;
mod health;
mod location;
mod not_found;
mod tournament;
mod lim;

pub fn make_router() -> Router {
    let mut router = Router::make();

    router
        .mount(HealthRoute {})
        .mount(CountriesRoute {})
        .mount(AuthRoute {})
        .mount(EndSessionRoute {})
        .mount_pack(TournamentPack {})
        .mount_pack(CountryPack {})
        .mount_pack(LocationPack {})
        .mount_pack(LimPack {})
        .mount(NotFoundRoute {});

    router
}
