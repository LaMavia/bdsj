use crate::router::Router;

use self::{
    auth::AuthRoute, countries::CountriesRoute, country::CountryPack, end_session::EndSessionRoute,
    health::HealthRoute, lim::LimPack, location::LocationPack, not_found::NotFoundRoute,
    participant::ParticipantPack, person::PersonPack, tournament::TournamentPack,
};

mod auth;
mod countries;
mod country;
mod end_session;
mod health;
mod lim;
mod location;
mod not_found;
mod participant;
mod person;
mod round;
mod tournament;

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
        .mount_pack(ParticipantPack {})
        .mount_pack(round::Pack {})
        .mount(NotFoundRoute {});

    router
}
