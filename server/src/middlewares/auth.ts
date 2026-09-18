import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import UserModel from "../models/userModel.js";

interface JWTPayload {
    userId: string,
    role: string
}

export interface AuthRequest extends Request {
    userId?: string,
    role?: string
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            console.log("Block 1");
            return res.status(400).json({ success: false, message: "Something went wrong" });
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET as string);

        if (!decoded) {
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }

        const user = await UserModel.findById((decoded as JWTPayload).userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        req.userId = (decoded as JWTPayload).userId;
        req.role = user.role;

        return next();
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }

        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}