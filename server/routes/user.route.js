import { Router } from "express";

import authorize from "../middlewares/auth.middleware.js";
import { getUserMe, editProfile, getUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/me', authorize, getUserMe);

userRouter.put('/me', authorize, editProfile);

userRouter.get('/:userId', authorize, getUser);

export default userRouter;