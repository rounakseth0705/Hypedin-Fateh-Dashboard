import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { verifyAccess } from "../middlewares/role.js";
import { getRewards, getTasks, submitTask } from "../controllers/ambassadorControllers.js";
import { taskUploadMiddleware } from "../utils/multer.js";

const ambassadorRouter = express.Router();

ambassadorRouter.post("/submitTask/:taskId", authMiddleware, verifyAccess("Ambassador"), taskUploadMiddleware.array("images",4), submitTask);
ambassadorRouter.get("/getTasks", authMiddleware, getTasks);
ambassadorRouter.get("/getRewards", authMiddleware, getRewards);

export default ambassadorRouter;