import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import InboxMessageModel from "../models/inboxMessageModel.js";
import UserModel from "../models/userModel.js";
import type { Auth } from "googleapis";
import { Readable } from "stream";
import { drive } from "../utils/googleDrive.js";

const sendMessageToInbox = async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;
        const files = req.files as Express.Multer.File[];
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Details missing" });
        }
    
        const user = await UserModel.findById(userId);
    
        if (!user) {
            return res.status(500).json({ success: false, message: "Something went wrong, try again." });
        }

        const DRIVE_FOLDER_ID: string = "15N1iEfgI7zE18xZXfVRcGBOPvzUl7Dd1"
        let attachmentLinks: string[] = [];

        console.log(DRIVE_FOLDER_ID);
    
        if (files.length > 0) {
            if (!DRIVE_FOLDER_ID) {
                throw new Error("DRIVE FOLDER ID NOT FOUND");
            }
            for (const file of files) {
                const bufferStream = Readable.from(file.buffer);
                const driveResponse = await drive.files.create({
                    requestBody: {
                        name: `${user.name}_${user._id}`,
                        parents: [DRIVE_FOLDER_ID],
                    },
                    media: {
                        mimeType: file.mimetype,
                        body: bufferStream,
                    },
                    fields: 'id, webViewLink',
                });
                const { id: fileId, webViewLink } = driveResponse.data;
                if (fileId && webViewLink) {
                    await drive.permissions.create({
                        fileId,
                        requestBody: { role: 'reader', type: 'anyone' },
                    });
    
                    attachmentLinks.push(webViewLink);
                }
            }
        }

        if (files.length > 0) {
            await InboxMessageModel.create({ message, userId, isImageAttached: true, attachmentLinks });
        } else {
            await InboxMessageModel.create({ message, userId, isImageAttached: false });
        }
    
        return res.status(200).json({ success: true, message: "Message successfully dropped" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
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