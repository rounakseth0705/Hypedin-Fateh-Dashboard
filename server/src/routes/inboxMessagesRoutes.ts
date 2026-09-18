import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { verifyAccess } from "../middlewares/role.js";
import { getMessages, sendMessageToInbox } from "../controllers/inboxMessageControllers.js";

const inboxMessagesRouter = express.Router();

inboxMessagesRouter.post("/sendMessage", authMiddleware, verifyAccess("Admin"), sendMessageToInbox);
inboxMessagesRouter.get("/getMessages", authMiddleware, getMessages);

export default inboxMessagesRouter;