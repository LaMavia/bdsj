use crate::router::Router;

use self::{
    auth::AuthRoute, countries::CountriesRoute, country::CountryPack, end_session::EndSessionRoute,
    health::HealthRoute, lim::LimPack, location::LocationPack, not_found::NotFoundRoute,
    person::PersonPack, tournament::TournamentPack, participant::ParticipantPack,
};

mod auth;
mod countries;
mod country;
mod end_session;
mod health;
mod lim;
mod location;
mod not_found;
mod person;
mod tournament;
mod participant;

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
        .mount_pack(PersonPack {})
        .mount_pack(ParticipantPack)
        .mount(NotFoundRoute {});

    router
}
