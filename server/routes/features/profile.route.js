import { Router } from "express";

import authorize from '../../middlewares/auth.middleware.js';
import { getUserMeProfile, getUserProfile } from "../../controllers/features/profile.controller.js";

const profileRouter = Router();

profileRouter.get('/profile/me', authorize, getUserMeProfile);

profileRouter.get('/user/:userId', authorize, getUserProfile);

export default profileRouter;