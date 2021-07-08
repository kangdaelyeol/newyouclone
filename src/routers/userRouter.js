import express from "express";
import {
  logout,
  remove,
  see,
  gitLoginStart,
  gitFinishLogin,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  protectedMiddleware,
  publicOnlyMiddleware,
  uploadAvatar,
} from "../middwares";
const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectedMiddleware)
  .get(getEditProfile)
  .post(uploadAvatar.single("avatar"), postEditProfile);
userRouter.get("/logout", protectedMiddleware, logout);
userRouter.get("/remove", remove);
userRouter.get("/gitlogin", publicOnlyMiddleware, gitLoginStart);
userRouter.get("/github/finish", publicOnlyMiddleware, gitFinishLogin);
userRouter
  .route("/change-password")
  .all(protectedMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
export default userRouter;
userRouter.get("/:id", see);
