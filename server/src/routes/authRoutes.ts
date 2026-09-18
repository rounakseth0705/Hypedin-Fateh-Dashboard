import express from "express";
import { setPassword, login, logout, changePassword } from "../controllers/authControllers.js";
import { authMiddleware } from "../middlewares/auth.js";
import { verifyAccess } from "../middlewares/role.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.put("/setPassword", authMiddleware, verifyAccess("Ambassador"), setPassword);
authRouter.post("/logout", logout);
authRouter.put("/changePassword", authMiddleware, changePassword);

export default authRouter;