import { Router } from "express";
import { getFeed } from "../controllers/feed.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const feedRouter = Router();

feedRouter.get('/', authorize, getFeed);

export default feedRouter;