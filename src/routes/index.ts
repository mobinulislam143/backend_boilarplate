import { userRoutes } from "../modules/auth/auth.route";

const express = require('express')
const router = express.Router();

const moduleRoutes =[
    {
        path: '/auth',
        route: userRoutes
    }
]
moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router