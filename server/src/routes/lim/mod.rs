mod get;
mod post;

pub struct LimPack;
impl crate::router::Mounter for LimPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router.mount(post::Route).mount(get::Route)
    }
}
