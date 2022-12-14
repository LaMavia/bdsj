mod delete;
mod get;
mod post;
use self::delete::DeleteRoute;
use self::get::GetRoute;

pub struct CountryPack;
impl crate::router::Mounter for CountryPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router
            .mount(GetRoute {})
            .mount(post::Route {})
            .mount(DeleteRoute {})
    }
}
