import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { verifyAccess } from "../middlewares/role.js";
import { getMySubmissions, getRewards, getTasks, reSubmitTask, submitTask } from "../controllers/ambassadorControllers.js";
import { taskUploadMiddleware } from "../utils/multer.js";

const ambassadorRouter = express.Router();

ambassadorRouter.post("/submitTask/:taskId", authMiddleware, verifyAccess("Ambassador"), taskUploadMiddleware.array("images",4), submitTask);
ambassadorRouter.get("/getTasks", authMiddleware, getTasks);
ambassadorRouter.get("/getRewards", authMiddleware, getRewards);
ambassadorRouter.get("/getMySubmissions", authMiddleware, verifyAccess("Ambassador"), getMySubmissions);
ambassadorRouter.put("/reSubmitTask/:taskId", authMiddleware, verifyAccess("Ambassador"), taskUploadMiddleware.array("images",4), reSubmitTask);

export default ambassadorRouter;