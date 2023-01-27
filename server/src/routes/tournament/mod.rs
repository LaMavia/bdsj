mod country_info;
mod delete;
mod get;
mod post;
mod stage;

use crate::router::Mounter;

use self::country_info::CountriesGet;
use self::delete::DeleteRoute;
use self::get::GetRoute;

pub struct TournamentPack;
impl Mounter for TournamentPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router
            .mount(GetRoute {})
            .mount(DeleteRoute {})
            .mount(CountriesGet {})
            .mount(post::Route {})
            .mount_pack(stage::Pack {})
    }
}
