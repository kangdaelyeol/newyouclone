import express from "express";
import { registerView, enrollComment, deleteComment } from "../controllers/videoController";
const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-z]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-z]{24})/comment", enrollComment);
apiRouter.delete("/videos/:id([0-9a-z]{24})/delete", deleteComment);
export default apiRouter;
