import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { verifyAccess } from "../middlewares/role.js";
import { getMessages, sendMessageToInbox } from "../controllers/inboxMessageControllers.js";
import { taskUploadMiddleware } from "../utils/multer.js";

const inboxMessagesRouter = express.Router();

inboxMessagesRouter.post("/sendMessage", authMiddleware, verifyAccess("Admin"), taskUploadMiddleware.array("images", 3), sendMessageToInbox);
inboxMessagesRouter.get("/getMessages", authMiddleware, getMessages);

export default inboxMessagesRouter;