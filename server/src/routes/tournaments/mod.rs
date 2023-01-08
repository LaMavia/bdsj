mod get;

use crate::router::Mounter;

use self::get::GetRoute;

pub struct TournamentsPack;
impl Mounter for TournamentsPack {
    fn mount(router: &mut crate::router::Router) -> &crate::router::Router {
        router.mount(GetRoute {})
    }
}
