import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import InboxMessageModel from "../models/inboxMessageModel.js";
import UserModel from "../models/userModel.js";
import type { Auth } from "googleapis";

const sendMessageToInbox = async (req: AuthRequest, res: Response) => {
    const { message } = req.body;
    const userId = req.userId;

    if (!message || !userId) {
        return res.status(400).json({ success: false, message: "Details missing" });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
        return res.status(500).json({ success: false, message: "Something went wrong, try again." });
    }

    await InboxMessageModel.create({ message, userId });

    return res.status(200).json({ success: true, message: "Message successfully dropped" });
}

const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const messages = await InboxMessageModel.find({});

        if (!messages) {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }

        return res.status(200).json({ success: true, messages, message: "Messages fetched" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export { sendMessageToInbox, getMessages }