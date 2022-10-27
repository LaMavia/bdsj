use crate::router::Router;

use self::health::HealthRoute;

mod health;

pub fn make_router() -> Router {
    let mut router = Router::make();

    router.mount(HealthRoute {});

    router
}
