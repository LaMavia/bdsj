mod delete;
mod get;
mod stage;

use crate::router::Mounter;

use self::delete::DeleteRoute;
use self::get::GetRoute;

pub struct TournamentPack;
impl Mounter for TournamentPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router
            .mount(GetRoute {})
            .mount(DeleteRoute {})
            .mount_pack(stage::Pack {})
    }
}
