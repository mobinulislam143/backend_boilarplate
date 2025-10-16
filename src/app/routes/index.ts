// import { userRoutes } from "../modules/auth/auth.route";

import { UserRoute } from "../modules/auth/auth.route";
import { ImageRoutes } from "../modules/imageupload/image.route";

// import { userRoutes } from "../../modules/auth/auth.route";

const express = require('express')
const router = express.Router();

const moduleRoutes =[
    {
        path: '/auth',
        route: UserRoute
    },
    {
        path: '/image',
        route: ImageRoutes
    },
]
moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router