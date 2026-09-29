import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import TaskModel from "../models/taskModel.js";
import RewardModel from "../models/rewardModel.js";
import { Readable } from "stream";
import { drive } from "../utils/googleDrive.js";
import UserModel from "../models/userModel.js";
import AmbassadorModel from "../models/ambassadorModel.js";
import SubmissionModel from "../models/submissionsModel.js";
import { updateTwoValuesBasedOnOneValueInSheets, logToGoogleSheets, updateThreeValuesBasedOnOneValueInSheets } from "../utils/googleSheets.js";

const submitTask = async (req: AuthRequest, res: Response) => {
    let submission;
    try {
        const { proofURLs } = req.body;
        const { taskId } = req.params;
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

        const isSubmissionExists = await SubmissionModel.findOne({ ambassadorId: ambassador._id, taskId });

        if (isSubmissionExists && task.periodicity === "One Time") {
            return res.status(400).json({ success: false, message: "Task has been already submitted" });
        }

        if (isSubmissionExists && isSubmissionExists.proofURLs.length > 1 && task.periodicity === "Two Time") {
            return res.status(400).json({ success: false, message: "Both the links have already been for this task" });
        }

        const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID_SUBMISSIONS as string;

        if (files) {
            if (!DRIVE_FOLDER_ID) {
                throw new Error("DRIVE FOLDER NOT FOUND");
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
                    
                    proofURLs.push(webViewLink);
                }
            }
        }

        let isSubmittingTwice: boolean = false;

        if (task.periodicity === "Two Time" && isSubmissionExists) {
            proofURLs.push(isSubmissionExists.proofURLs[0]);
            submission = await SubmissionModel.findById(isSubmissionExists._id);
            if (!submission || !submission.proofURLs) {
                throw new Error("Submission failed, please try again")
            }
            submission.proofURLs = proofURLs;
            await submission.save();
            isSubmittingTwice = true;
        } else {
            submission = await SubmissionModel.create({ ambassadorId: ambassador._id, taskId: task._id, proofURLs, status: "Pending" });
        }

        if (!submission) {
            return res.status(500).json({ success: false, message: "Submission Failed, please try agin" });
        }

        const googleSheetId: string | undefined = process.env.GOOGLE_SHEETS_ID_SUBMISSION;

        if (!googleSheetId) {
            throw new Error("Submission Failed, please try again");
        }

        if (submission.proofURLs.length < 1) {
            throw new Error("No Submission links found");
        }

        let rawProofURL: string = submission.proofURLs[0] as string;
        let rawProofURL2: string | undefined;

        if (submission.proofURLs.length > 1) {
            rawProofURL2 = submission.proofURLs[1];
        }

        let result: boolean;

        if (isSubmittingTwice) {
            if (!rawProofURL2) {
                throw new Error("Submission failed, please try again.");
            }
            result = await updateThreeValuesBasedOnOneValueInSheets(googleSheetId, 0, submission._id.toString(), "E", rawProofURL, "F", rawProofURL2, "G", submission.status);
        } else if (rawProofURL2) {
            result = await logToGoogleSheets(googleSheetId,[submission._id.toString(), user.email, user.phoneNo, task.title, rawProofURL, rawProofURL2, submission.status]);
        } else {
            result = await logToGoogleSheets(googleSheetId,[submission._id.toString(), user.email, user.phoneNo, task.title, rawProofURL, submission.status]);
        }

        if (!result) {
            throw new Error("Submission Failed, please try again");
        }

        ambassador.taskSubmitted = (ambassador.taskSubmitted || 0) + 1;
        if (!Array.isArray(ambassador.submittedTasks)) {
            ambassador.submittedTasks = [];
        }
        ambassador.submittedTasks.push(task._id);
        await ambassador.save();

        return res.status(200).json({ success: true, message: "Task Submitted" });
    } catch(error: unknown) {
        console.log(error);

        if (submission) {
            await SubmissionModel.findByIdAndDelete(submission._id);
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

        const user = await UserModel.create({ name, email, phoneNo, password, hasChangePassword: false, role: "Ambassador" });

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

const getMySubmissions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(500).json({ success: false, message: "User not found" });
        }

        const ambassador = await AmbassadorModel.findOne({ userId });

        if (!ambassador) {
            return res.status(500).json({ success: false, message: "Ambassador not found" });
        }

        const submissions = await SubmissionModel.find({ ambassadorId: ambassador._id }).populate("taskId","title");

        return res.status(200).json({ success: true, submissions, message: "Submissions fetched" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const reSubmitTask = async (req: AuthRequest, res: Response) => {
    try {
        const { proofURLs } = req.body;
        const { taskId } = req.params;
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

        const existingSubmission = await SubmissionModel.findOne({ ambassadorId: ambassador._id, taskId });

        if (!existingSubmission || existingSubmission.status !== "Rejected") {
            return res.status(400).json({ success: false, message: "Re submission failed" });
        }

        const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID_SUBMISSIONS as string;

        if (files) {
            if (!DRIVE_FOLDER_ID) {
                throw new Error("DRIVE FOLDER NOT FOUND");
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
                    
                    proofURLs.push(webViewLink);
                }
            }
        }

        existingSubmission.proofURLs = proofURLs;
        existingSubmission.status = "ReSubmitted";
        await existingSubmission.save();

        const googleSheetId: string | undefined = process.env.GOOGLE_SHEETS_ID_SUBMISSION;

        if (!googleSheetId) {
            throw new Error("Submission Failed, please try again");
        }

        if (existingSubmission.proofURLs.length < 1) {
            throw new Error("No Submission links found");
        }

        let rawProofURL: string = existingSubmission.proofURLs[0] as string;
        let rawProofURL2: string | undefined;

        if (existingSubmission.proofURLs.length > 1) {
            rawProofURL2 = existingSubmission.proofURLs[1];
        }

        let result: boolean;

        if (rawProofURL2) {
            result = await updateThreeValuesBasedOnOneValueInSheets(googleSheetId, 0, existingSubmission._id.toString(), "E", rawProofURL, "F", rawProofURL2, "G", existingSubmission.status);
        } else {
            result = await updateThreeValuesBasedOnOneValueInSheets(googleSheetId, 0, existingSubmission._id.toString(), "E", rawProofURL, "F", existingSubmission.status, "G", "");
        }

        if (!result) {
            throw new Error("Submission Failed, please try again");
        }

        return res.status(200).json({ success: true, message: "Task Submitted" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const setProfilePicture = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const file = req.file as Express.Multer.File;

        if (!userId || !file) {
            return res.status(400).json({ success: false, message: "Image not found" });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(500).json({ success: false, message: "User not found" });
        }

        const DRIVE_FOLDER_ID: string | undefined = process.env.GOOGLE_DRIVE_FOLDER_ID_PROFILE_PICTURE;

        if (!DRIVE_FOLDER_ID) {
            throw new Error("Drive FOLDER NOT FOUND");
        }

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
        })

        const { id: fileId, webViewLink } = driveResponse.data

        if (fileId && webViewLink) {
            await drive.permissions.create({
                fileId,
                requestBody: { role: 'reader', type: 'anyone' },
            });

            user.profilePictureLink = webViewLink;
        }

        user.isProfilePictureSet = true;
        await user.save();

        return res.status(200).json({ success: true, message: "Profile picture successfully set" });
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const removeProfilePicture = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.profilePictureLink) {
            return res.status(400).json({ success: false, message: "Profile picture not found" });
        }

        const fileUrl = user.profilePictureLink;

        const match = fileUrl.match(/\/d\/([^/]+)/);

        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid Google Drive URL" });
        }

        const fileId = match[1];

        if (!fileId) {
            return res.status(400).json({ success: false, message: "Invalid Google Drive file ID" });
        }

        const response = await drive.files.delete({ fileId });

        if (response.status !== 204) {
            throw new Error("Error in deleting the profile picture");
        }

        await UserModel.findByIdAndUpdate(userId, { $unset: { profilePictureLink: 1 }, $set: { isProfilePictureSet: false } });

        return res.status(200).json({ success: true, message: "Profile picture removed" });

    } catch (error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export { submitTask, getTasks, getRewards, createAmbassadorAccount, getMySubmissions, reSubmitTask, setProfilePicture, removeProfilePicture }