import express from "express";
import {
  getLogin,
  postLogin,
  getJoin,
  postJoin,
} from "../controllers/userController";
import { search, home } from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middwares";

const rootRouter = express.Router();

// videoController
rootRouter.get("/search", search);

// userController
rootRouter.get("/", home);

rootRouter
  .route("/join")
  .get(publicOnlyMiddleware, getJoin)
  .post(publicOnlyMiddleware, postJoin);

rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);

export default rootRouter;
