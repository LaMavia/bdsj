use self::{get::GetRoute, put::PutRoute};

mod get;
mod put;

pub struct LocationPack;
impl crate::router::Mounter for LocationPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router.mount(GetRoute {}).mount(PutRoute {})
    }
}
