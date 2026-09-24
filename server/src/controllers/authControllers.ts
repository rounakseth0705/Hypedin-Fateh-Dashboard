import type { Request, Response } from "express";
import UserModel from "../models/userModel.js";
import type { AuthRequest } from "../middlewares/auth.js";
import AmbassadorModel from "../models/ambassadorModel.js";

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email or Password is missing" });
        }

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email" });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        let platformDetails = null;

        if (user.role === "Ambassador") {
            platformDetails = await AmbassadorModel.findOne({ userId: user._id });
        }

        if (user.role === "Ambassador" && !platformDetails) {
            return res.status(500).json({ success: false, message: "Ambassador not found" });
        }

        const token = user.createJWT();

        if (!token) {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        if (user.role === "Ambassador") {
            return res.status(200).json({ success: true, user, ambassador: platformDetails, message: "Logged in successfully" });
        } else {
            return res.status(200).json({ success: true, user, message: "Logged in successfully" });
        }
    } catch(error: unknown) { 
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const verifyMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const role = req.role;

        if (!userId || !role) {
            return res.status(500).json({ success: false, message: "User details not found" });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(500).json({ success: false, message: "User not found" });
        }

        let platformDetails;

        if (role === "Ambassador") {
            platformDetails = await AmbassadorModel.findOne({ userId });
        }

        if (user.role === "Ambassador" && !platformDetails) {
            return res.status(500).json({ success: false, message: "Details not found" });
        }

        if (role === "Ambassador") {
            return res.status(200).json({ success: true, user, ambassador: platformDetails, message: "Ambassador verified" });
        } else {
            return res.status(200).json({ success: true, user, message: "Admin verified" });
        }
    } catch(error: unknown) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const setPassword = async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        if (!currentPassword || !newPassword || !userId) {
            return res.status(400).json({ success: false, message: "Current or New password is missing" });
        }

        const user = await UserModel.findById(userId).select("+password");

        if (!user) {
            return res.status(500).json({ success: false, message: "User not found" });
        }

        const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

        if (!isCurrentPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        user.password = newPassword;
        user.hasChangePassword = true;
        await user.save();

        return res.status(200).json({ success: true, message: "Password set successfully" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const logout = (req: AuthRequest, res: Response) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({ success: false, message: "Logged out successfully" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        if (!currentPassword || !newPassword || !userId) {
            return res.status(400).json({ success: false, message: "Current or New password is missing" });
        }

        const user = await UserModel.findById(userId).select("+password");

        if (!user) {
            return res.status(500).json({ success: false, message: "User not found" });
        }

        const isPasswordCorrect = await user.comparePassword(currentPassword);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ success: false, message: "Current and new password can't be same" });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Password Changed" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }
    }
}

export { login, setPassword, logout, changePassword, verifyMe }