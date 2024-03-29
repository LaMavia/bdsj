mod get;
mod next;

pub struct Pack;
impl crate::router::Mounter for Pack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router.mount(get::Route {}).mount(next::Route {})
    }
}
