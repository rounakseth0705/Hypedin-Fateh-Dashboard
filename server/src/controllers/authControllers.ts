import type { Request, Response } from "express";
import UserModel from "../models/userModel.js";
import type { AuthRequest } from "../middlewares/auth.js";
import AmbassadorModel from "../models/ambassadorModel.js";
import AdminModel from "../models/adminModel.js";

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
        } else if (user.role === "Admin") {
            platformDetails = await AdminModel.findOne({ userId: user._id });
        }

        if (!platformDetails) {
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
            return res.status(200).json({ success: true, user, admin: platformDetails, message: "Logged in successfully" });
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

        const isCurrentPasswordCorrect = user.comparePassword(currentPassword);

        if (!isCurrentPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        user.password = newPassword;
        user.hasChangedPassword = true;
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

        const isPasswordCorrect = user.comparePassword(user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ success: false, message: "Password Changed" });
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }
    }
}

export { login, setPassword, logout, changePassword }