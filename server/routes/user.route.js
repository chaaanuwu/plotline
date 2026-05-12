import { Router } from "express";

import authorize from "../middlewares/auth.middleware.js";
import {
    getUserMe,
    editProfile,
    getUser,
    searchUsers,
    updateAccountSettings,
    verifyPassword
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get('/me', authorize, getUserMe);

userRouter.put('/me/edit', authorize, editProfile);

userRouter.put('/me/update-account', authorize, updateAccountSettings);

userRouter.post('/me/verify-password', authorize, verifyPassword);

userRouter.get('/search', authorize, searchUsers);

export default userRouter;