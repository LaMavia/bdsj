mod delete;
mod get;
mod get_desc;
mod gets;
mod post;
mod tournaments;
use self::delete::DeleteRoute;
use self::get::GetRoute;

pub struct CountryPack;
impl crate::router::Mounter for CountryPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router
            .mount(GetRoute {})
            .mount(post::Route {})
            .mount(DeleteRoute {})
            .mount(get_desc::Route {})
            .mount(gets::Route {})
            .mount(tournaments::Route {})
    }
}
