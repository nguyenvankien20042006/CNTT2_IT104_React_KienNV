import { createBrowserRouter } from "react-router-dom";
import authRoutes from "./auth.routes";
import postRoutes from "./post.routes";

const routes = [...authRoutes, ...postRoutes];

const routers = createBrowserRouter(routes);

export default routers;
