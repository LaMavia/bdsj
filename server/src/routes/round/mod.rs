mod exists;
mod get;
mod update_entries;

pub struct Pack;
impl crate::router::Mounter for Pack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router
            .mount(get::Route {})
            .mount(update_entries::Route {})
            .mount(exists::Route {})
    }
}
