mod delete;
mod get;
mod post;
mod tournaments;

pub struct LocationPack;
impl crate::router::Mounter for LocationPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router
            .mount(get::Route {})
            .mount(post::Route {})
            .mount(tournaments::Route {})
            .mount(delete::Route {})
    }
}
