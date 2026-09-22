import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { verifyAccess } from "../middlewares/role.js";
import { createReward, createTask, deleteTask, getAmbassadors, seedAmbassador, seedPOC } from "../controllers/adminControllers.js";

const adminRouter = express.Router();

adminRouter.post("/createTask", authMiddleware, verifyAccess("Admin"), createTask);
adminRouter.delete("/deleteTask/:taskId", authMiddleware, verifyAccess("Admin"), deleteTask);
adminRouter.get("/getAmbassadors", authMiddleware, verifyAccess("Admin"), getAmbassadors);
adminRouter.post("/createReward", authMiddleware, verifyAccess("Admin"), createReward);
adminRouter.post("/createAmbassador", authMiddleware, verifyAccess("Admin"), seedAmbassador);
adminRouter.post("/createPOC", authMiddleware, verifyAccess("Admin"), seedPOC);

export default adminRouter;