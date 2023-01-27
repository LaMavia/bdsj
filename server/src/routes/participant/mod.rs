// mod get;
mod post;

pub struct ParticipantPack;
impl crate::router::Mounter for ParticipantPack {
    fn mount(self, router: &mut crate::router::Router) -> &mut crate::router::Router {
        router.mount(post::Route {})
    }
}
