mod delete;
mod get;
mod get_short;
mod post;
mod tournaments;

pub struct PersonPack;
impl crate::router::Mounter for PersonPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router
            .mount(get::Route {})
            .mount(get_short::Route {})
            .mount(post::Route {})
            .mount(tournaments::Route {})
            .mount(delete::Route {})
    }
}
