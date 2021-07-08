import express from "express";
import {
  getEdit,
  postEdit,
  see,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectedMiddleware, uploadVideo } from "../middwares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", see);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectedMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/upload")
  .all(protectedMiddleware)
  .get(getUpload)
  .post(
    uploadVideo.fields([
      { name: "video", maxCount: 1 },
      { name: "thumb", maxCount: 1 },
    ]),
    postUpload,
  );
videoRouter.get("/:id([0-9a-f]{24})/delete", protectedMiddleware, deleteVideo);
export default videoRouter;
