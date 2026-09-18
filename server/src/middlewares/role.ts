import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.js";

export const verifyAccess = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRole = (req as AuthRequest).role;

            if (!userRole) {
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }
            if (!allowedRoles.includes(userRole)) {
                return res.status(400).json({ success: false, message: "Access Denied" });
            }

            return next();
        } catch(error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("Unknown Error:", error);
            }
        }
    }
}