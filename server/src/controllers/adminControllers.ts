import type { Request, Response } from "express";
import { Readable } from "stream";
import type { AuthRequest } from "../middlewares/auth.js";
import TaskModel from "../models/taskModel.js";
import AmbassadorModel from "../models/ambassadorModel.js";
import RewardModel from "../models/rewardModel.js";
import UserModel from "../models/userModel.js";
import { drive } from "../utils/googleDrive.js";
import { nanoid } from "nanoid";
import POCModel from "../models/pocModel.js";
import { sendWelcomeMail } from "../utils/mailer.js";
import SubmissionModel from "../models/submissionsModel.js";

const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, periodicity, activity, target, taskMonth, taskWeek, isImageAllowed, isVideoAllowed } = req.body;
        const userId = req.userId;

        if (!title || !description || !periodicity || !activity || !taskMonth) {
            return res.status(400).json({ success: false, message: "Some details are missing" });
        }

        if (!userId) {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }

        const isTaskExists = await TaskModel.findOne({ title });

        if (isTaskExists) {
            return res.status(400).json({ success: false, message: "Task already exists" });
        }
        
        if (target) {
            await TaskModel.create({ title, description, periodicity, activity, target, taskMonth, taskWeek, isImageAllowed, isVideoAllowed, createdBy: userId });
        } else {
            await TaskModel.create({ title, description, periodicity, activity, taskMonth, taskWeek, isImageAllowed, isVideoAllowed, createdBy: userId });
        }

        return res.status(200).json({ success: true, message: "Task created" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteTask = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        if (!taskId) {
            return res.status(400).json({ success: false, message: "Couldn't delete task" });
        }

        const deletedTask = await TaskModel.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(400).json({ success: false, message: "Task not found" });
        }

        return res.status(200).json({ success: true, message: "Task deleted" });
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
        const tasks = await TaskModel.find({ });

        return res.status(200).json({ success: true, tasks, message: "Tasks Fetched" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getSubmissions = async (req: Request, res: Response) => {
    try {
        const submissions = await SubmissionModel.find({});

        return res.status(200).json({ success: false, submissions, message: "Submissions Fetched" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getPOCs = async (req: Request, res: Response) => {
    try {
        const POCs = await POCModel.find({});

        return res.status(200).json({ success: true, POCs, message: "POCs fetched" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getAmbassadors = async (req: Request, res: Response) => {
    try {
        const ambassadors = await AmbassadorModel.find({}).populate("userId", "name email");

        return res.status(200).json({ success: true, message: "Ambassadors fetched" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const createReward = async (req: Request, res: Response) => {
    try {
        const { title, belongsTo } = req.body;

        if (!title || !belongsTo) {
            return res.status(400).json({ success: false, message: "Details missing" });
        }

        const isRewardExists = await RewardModel.findOne({ title });

        if (isRewardExists) {
            return res.status(400).json({ success: false, message: "Reward already exists" });
        }

        await RewardModel.create({ title, belongsTo });

        return res.status(200).json({ success: true, message: "Reward created" });
    } catch(error: unknown) {
        if (error instanceof Error) {

        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const allotUTMAndQR = async (req: AuthRequest, res: Response) => {
    let createdFileId: string | null = null;
    try {
        const { UTM, email } = req.body;
        const QR = req.file as Express.Multer.File;

        if (!UTM || !QR || !email) {
            return res.status(400).json({ success: false, message: "Either UTM or QR is missing. Please try again" });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        const ambassador = await AmbassadorModel.findOne({ userId: user._id });

        if (!ambassador) {
            return res.status(400).json({ success: false, message: "Ambassador not found" });
        }

        if (ambassador.isUTMAlloted || ambassador.isQRAlloted) {
            return res.status(400).json({ success: false, message: "Either UTM or QR is already alloted" });
        }

        const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID as string;

        if (!DRIVE_FOLDER_ID) {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
        
        const bufferStream = Readable.from(QR.buffer);
        
        const driveResponse = await drive.files.create({
            requestBody: {
                name: `${user.name}_${user._id || "randomAdmin"}`,
                parents: [DRIVE_FOLDER_ID],
            },
            media: {
                mimeType: QR.mimetype,
                body: bufferStream,
            },
            fields: 'id, webViewLink',
        });
        
        const { id: fileId, webViewLink } = driveResponse.data;
        
        if (!fileId || !webViewLink) {
            return res.status(500).json({ success: false, message: "Failed to upload the QR file" });
        }

        createdFileId = fileId;

        await drive.permissions.create({ fileId, requestBody: { role: 'reader', type: 'anyone' }});

        ambassador.QR = webViewLink;
        ambassador.UTM = UTM;
        ambassador.isUTMAlloted = true;
        ambassador.isQRAlloted = true;
        await ambassador.save();

        return res.status(200).json({ success: true, message: "UTM and QR alloted" });
    } catch(error: unknown) {
        console.log(error);

        if (createdFileId) {
            try {
                await drive.files.delete({ fileId: createdFileId });
                console.log("Cleaned up orphaned Drive file");
            } catch (cleanupErr) {
                console.log("Failed to clean up Drive file:", cleanupErr);
            }
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const seedAmbassador = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, phoneNo, city, college, POCPhoneNo } = req.body;

        if (!name || !email || !phoneNo || !city || !college || !POCPhoneNo) {
            return res.status(400).json({ success: false, message: "Details Missing" });
        }

        const isUserExists = await UserModel.findOne({ $or: [{ email },{ phoneNo }] });

        if (isUserExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const id = nanoid(10);

        const user = await UserModel.create({ name, email, phoneNo, role: "Ambassador", password: id, hasChangePassword: false });

        const POC = await POCModel.findOne({ phoneNo: POCPhoneNo });

        if (!POC) {
            return res.status(400).json({ success: false, message: "POC not found" });
        }

        await AmbassadorModel.create({ userId: user._id, city, college, POCID: POC._id });

        await sendWelcomeMail(email,id);

        return res.status(200).json({ success: true, message: "Ambassador created" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const seedPOC = async (req: AuthRequest, res: Response) => {
    try {
        const { name, phoneNo, email, password } = req.body;

        console.log(req.body);

        if (!name || !email || !phoneNo) {
            return res.status(400).json({ success: false, message: "Details Missing" });
        }

        const isPOCExists = await UserModel.findOne({ $or: [{ email },{ phoneNo }] });

        if (isPOCExists) {
            return res.status(400).json({ success: false, message: "POC already exists" });
        }

        const user = await UserModel.create({ name, email, phoneNo, password, role: "POC" });

        await POCModel.create({ name, email, phoneNo, userId: user._id });

        return res.status(200).json({ success: true, message: "POC created" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export { createTask, deleteTask, getTasks, getAmbassadors, createReward, allotUTMAndQR, seedAmbassador, seedPOC, getSubmissions, getPOCs }