import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import TaskModel from "../models/taskModel.js";
import RewardModel from "../models/rewardModel.js";
import { Readable } from "stream";
import { drive } from "../utils/googleDrive.js";
import UserModel from "../models/userModel.js";
import AmbassadorModel from "../models/ambassadorModel.js";
import SubmissionModel from "../models/submissionsModel.js";

const submitTask = async (req: AuthRequest, res: Response) => {
    try {
        const { proofURLs } = req.body;
        const taskId = req.params;
        const userId = req.userId;
        const files = req.files as Express.Multer.File[];

        if (!proofURLs || !taskId || !userId) {
            return res.status(400).json({ success: false, message: "Details missing" });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(500).json({ success: false, message: "User not found" });
        }

        const ambassador = await AmbassadorModel.findOne({ userId });

        if (!ambassador) {
            return res.status(400).json({ success: false, message: "Ambassador not found" });
        }

        const task = await TaskModel.findById(taskId);

        if (!task) {
            return res.status(400).json({ success: false, message: "Task not found" });
        }
        
        if ((task.isImageAllowed || task.isVideoAllowed) && !files) {
            return res.status(400).json({ success: false, message: "Documents required" });
        } else if ((!task.isImageAllowed && !task.isVideoAllowed) && files) {
            return res.status(400).json({ success: false, message: "Document not required" });
        }

        const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID as string;

        if (files) {
            for (const file of files) {
                const bufferStream = Readable.from(file.buffer);

                const driveResponse = await drive.files.create({
                    requestBody: {
                        name: `${user.name}_${ambassador.ID}`,
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
                    
                    proofURLs.push(webViewLink);
                }
            }
        }

        await SubmissionModel.create({ ambassadorId: ambassador._id, taskId: task._id, proofURLs, status: "Pending" });

        return res.status(200).json({ success: true, message: "Task Submitted" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const createAmbassadorAccount = async (req: Request, res: Response) => {
    try {
        const { name, email, phoneNo, password, ID, city, college } = req.body;

        if (!name || !email || !phoneNo || !password || !ID || !city || !college) {
            return res.status(400).json({ success: false, message: "Details missing" });
        }

        const isUserExists = await UserModel.findOne({ $or: [{ email },{ phoneNo },{ ID }] });

        if (!isUserExists) {
            return res.status(400).json({ success: false, message: "Email, Phone or Ambassador ID already exists" });
        }

        const user = await UserModel.create({ name, email, phoneNo, password, hasChangedPassword: false, role: "Ambassador" });

        await AmbassadorModel.create({ userId: user._id, ID, city, college });

        return res.status(200).json({ success: false, message: "Ambassador's account created" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await TaskModel.find({  });

        return res.status(200).json({ success: true, tasks, message: "Tasks fetched" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getRewards = async (req: Request, res: Response) => {
    try {
        const rewards = await RewardModel.find({ belongsTo: "Ambassador" });

        return res.status(200).json({ success: true, message: "Rewards fetched" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export { submitTask, getTasks, getRewards, createAmbassadorAccount }