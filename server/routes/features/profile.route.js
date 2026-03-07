import { Router } from "express";

import authorize from '../../middlewares/auth.middleware.js';
import { getUserMeProfile } from "../../controllers/features/profile.controller.js";

const profileRouter = Router();

profileRouter.get('/profile/me', authorize, getUserMeProfile);

export default profileRouter;