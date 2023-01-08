mod delete;
mod get;
mod put;
use self::delete::DeleteRoute;
use self::get::GetRoute;
use self::put::PutRoute;

pub struct CountryPack;
impl crate::router::Mounter for CountryPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router
            .mount(GetRoute {})
            .mount(PutRoute {})
            .mount(DeleteRoute {})
    }
}
